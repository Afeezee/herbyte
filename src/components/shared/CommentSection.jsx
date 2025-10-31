import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageCircle, Send, Trash2, Edit, User } from "lucide-react";
import { format } from "date-fns";

export default function CommentSection({ entityType, entityId, entityName }) {
  const [user, setUser] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Fetch current user
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("User not logged in");
      }
    };
    fetchUser();
  }, []);

  // Fetch comments
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', entityType, entityId],
    queryFn: async () => {
      const allComments = await base44.entities.Comment.filter({
        entity_type: entityType,
        entity_id: entityId
      }, '-created_date');
      return allComments;
    },
    initialData: [],
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: (commentData) => base44.entities.Comment.create(commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', entityType, entityId] });
      setNewComment("");
      setIsSubmitting(false);
    },
    onError: () => {
      setIsSubmitting(false);
      alert("Failed to post comment. Please try again.");
    }
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => base44.entities.Comment.delete(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', entityType, entityId] });
    },
  });

  const handleSubmitComment = async () => {
    if (!user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }

    if (!newComment.trim()) {
      alert("Please enter a comment");
      return;
    }

    setIsSubmitting(true);
    createCommentMutation.mutate({
      content: newComment,
      author_email: user.email,
      author_name: user.full_name || user.email,
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName
    });
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#2D5016]">
          <MessageCircle className="w-5 h-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        <div className="space-y-3">
          <Textarea
            placeholder={user ? "Share your thoughts, experiences, or questions..." : "Sign in to leave a comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user || isSubmitting}
            rows={3}
            className="resize-none"
          />
          {user ? (
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                className="bg-[#4A7C2E] hover:bg-[#2D5016]"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          ) : (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-900">
                <Button 
                  onClick={() => base44.auth.redirectToLogin(window.location.href)}
                  variant="link"
                  className="text-blue-600 hover:text-blue-800 p-0 h-auto font-medium"
                >
                  Sign in
                </Button>
                {" "}to join the conversation and share your insights
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-gray-500 text-center py-8">Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-[#4A7C2E]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-[#2D5016]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#2D5016]">
                          {comment.author_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(comment.created_date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                  
                  {(user?.email === comment.author_email || isAdmin) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}