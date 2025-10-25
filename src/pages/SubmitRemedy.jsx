import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, Loader2, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SubmitRemedy() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    herbs_used: "",
    health_condition: "",
    preparation_method: "",
    dosage: "",
    duration_of_use: "",
    observed_effects: "",
    submitter_name: "",
    submitter_contact: ""
  });
  const [aiModerating, setAiModerating] = useState(false);
  const [moderationResult, setModerationResult] = useState(null);
  const [submissionComplete, setSubmissionComplete] = useState(false);

  const createRemedyMutation = useMutation({
    mutationFn: (remedyData) => base44.entities.RemedySubmission.create(remedyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remedies'] });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAiModerating(true);

    try {
      // AI Moderation
      const moderationResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `As an expert herbalist and medical safety validator, analyze this herbal remedy submission for scientific credibility and safety:

Herbs Used: ${formData.herbs_used}
Health Condition: ${formData.health_condition}
Preparation Method: ${formData.preparation_method}
Dosage: ${formData.dosage}
Duration of Use: ${formData.duration_of_use}
Observed Effects: ${formData.observed_effects}

Evaluate:
1. Scientific credibility - does this seem plausible based on known herbal properties?
2. Safety concerns - are there any red flags, contraindications, or dangerous interactions?
3. Misleading claims - are the claimed effects realistic or exaggerated?
4. Risk level - classify as Low, Moderate, High, or Critical
5. Whether expert review is needed
6. Recommendation for approval status

Provide thorough, evidence-based analysis focused on user safety.`,
        response_json_schema: {
          type: "object",
          properties: {
            moderation_status: {
              type: "string",
              enum: ["Approved", "Flagged - Risk Identified", "Pending Review", "Rejected"]
            },
            risk_level: {
              type: "string",
              enum: ["Low", "Moderate", "High", "Critical"]
            },
            credibility_assessment: { type: "string" },
            safety_concerns: { type: "array", items: { type: "string" } },
            potential_interactions: { type: "array", items: { type: "string" } },
            expert_review_required: { type: "boolean" },
            feedback_summary: { type: "string" },
            recommendations: { type: "string" }
          }
        }
      });

      setModerationResult(moderationResponse);

      // Create submission with AI moderation data
      const submissionData = {
        ...formData,
        herbs_used: formData.herbs_used.split(',').map(h => h.trim()),
        moderation_status: moderationResponse.moderation_status,
        risk_level: moderationResponse.risk_level,
        expert_review_required: moderationResponse.expert_review_required,
        ai_feedback: JSON.stringify(moderationResponse)
      };

      await createRemedyMutation.mutateAsync(submissionData);
      setSubmissionComplete(true);

    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit remedy. Please try again.");
    }

    setAiModerating(false);
  };

  if (submissionComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-[#2D5016] mb-4">
              Thank You for Your Submission!
            </h2>
            
            <div className="mb-6">
              {moderationResult?.moderation_status === "Approved" && (
                <Badge className="bg-green-500 text-white text-lg px-4 py-2">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approved for Publication
                </Badge>
              )}
              {moderationResult?.moderation_status === "Pending Review" && (
                <Badge className="bg-blue-500 text-white text-lg px-4 py-2">
                  <Info className="w-5 h-5 mr-2" />
                  Pending Expert Review
                </Badge>
              )}
              {moderationResult?.moderation_status === "Flagged - Risk Identified" && (
                <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Flagged for Review
                </Badge>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              {moderationResult?.feedback_summary}
            </p>

            {moderationResult?.safety_concerns && moderationResult.safety_concerns.length > 0 && (
              <Alert className="mb-6 text-left">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Safety Notes:</strong>
                  <ul className="mt-2 space-y-1">
                    {moderationResult.safety_concerns.map((concern, index) => (
                      <li key={index}>• {concern}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Button onClick={() => {
                setSubmissionComplete(false);
                setModerationResult(null);
                setFormData({
                  herbs_used: "",
                  health_condition: "",
                  preparation_method: "",
                  dosage: "",
                  duration_of_use: "",
                  observed_effects: "",
                  submitter_name: "",
                  submitter_contact: ""
                });
              }}>
                Submit Another Remedy
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/"}>
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2D5016] mb-4">
            Submit a Herbal Remedy
          </h1>
          <p className="text-lg text-gray-600">
            Share your traditional herbal knowledge with our community. All submissions are reviewed by AI for safety and credibility.
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>No sign-up required!</strong> Your submission will be automatically validated by our AI safety system and reviewed by experts. Personal information is optional.
          </AlertDescription>
        </Alert>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[#2D5016]">Remedy Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="herbs">Herbs Used *</Label>
                <Input
                  id="herbs"
                  required
                  value={formData.herbs_used}
                  onChange={(e) => setFormData({...formData, herbs_used: e.target.value})}
                  placeholder="e.g., Chamomile, Lavender, Peppermint (separate with commas)"
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">List all herbs used, separated by commas</p>
              </div>

              <div>
                <Label htmlFor="condition">Health Condition Addressed *</Label>
                <Input
                  id="condition"
                  required
                  value={formData.health_condition}
                  onChange={(e) => setFormData({...formData, health_condition: e.target.value})}
                  placeholder="e.g., Insomnia, Anxiety, Digestive issues"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="preparation">Preparation Method *</Label>
                <Textarea
                  id="preparation"
                  required
                  value={formData.preparation_method}
                  onChange={(e) => setFormData({...formData, preparation_method: e.target.value})}
                  placeholder="Describe how the herbs were prepared (e.g., tea, tincture, poultice, etc.)"
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="dosage">Dosage *</Label>
                  <Input
                    id="dosage"
                    required
                    value={formData.dosage}
                    onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                    placeholder="e.g., 1 cup 3 times daily"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration of Use *</Label>
                  <Input
                    id="duration"
                    required
                    value={formData.duration_of_use}
                    onChange={(e) => setFormData({...formData, duration_of_use: e.target.value})}
                    placeholder="e.g., 2 weeks, 1 month"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="effects">Observed Effects *</Label>
                <Textarea
                  id="effects"
                  required
                  value={formData.observed_effects}
                  onChange={(e) => setFormData({...formData, observed_effects: e.target.value})}
                  placeholder="Describe the effects you experienced, both positive and negative"
                  rows={5}
                  className="mt-2"
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg text-[#2D5016] mb-4">
                  Optional Contact Information
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Providing your contact information allows our experts to reach out for additional details if needed.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Your Name (Optional)</Label>
                    <Input
                      id="name"
                      value={formData.submitter_name}
                      onChange={(e) => setFormData({...formData, submitter_name: e.target.value})}
                      placeholder="Full name"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact">Contact (Optional)</Label>
                    <Input
                      id="contact"
                      type="email"
                      value={formData.submitter_contact}
                      onChange={(e) => setFormData({...formData, submitter_contact: e.target.value})}
                      placeholder="Email address"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  By submitting, you acknowledge that your remedy will be reviewed for scientific credibility and safety. We may contact you for additional information.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                disabled={aiModerating}
                className="w-full bg-[#4A7C2E] hover:bg-[#2D5016] text-lg py-6"
              >
                {aiModerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    AI is validating your submission...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Remedy for Review
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}