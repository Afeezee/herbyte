import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, CheckCircle, AlertTriangle, Info, Upload, X, Beaker, Leaf, User as UserIcon } from "lucide-react";

export default function SubmitRemedy() {
  const [activeTab, setActiveTab] = useState("remedy");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("User not logged in");
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <UserIcon className="w-12 h-12 text-[#4A7C2E] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              You need to be signed in to contribute knowledge and submit remedies or herbs to the Herbyte community.
            </p>
            <Button 
              onClick={() => base44.auth.redirectToLogin(window.location.href)}
              className="bg-[#4A7C2E] hover:bg-[#2D5016]"
            >
              Sign In to Continue
            </Button>
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
            Contribute to Herbyte
          </h1>
          <p className="text-lg text-gray-600">
            Share your herbal knowledge with the community. Submit remedies or individual herb profiles.
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>AI-Powered Publishing!</strong> Our AI validates submissions for safety, adds research references, and publishes approved content instantly.
          </AlertDescription>
        </Alert>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white border">
            <TabsTrigger value="remedy" className="flex items-center gap-2">
              <Beaker className="w-4 h-4" />
              Submit Remedy
            </TabsTrigger>
            <TabsTrigger value="herb" className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Submit Herb
            </TabsTrigger>
          </TabsList>

          <TabsContent value="remedy">
            <RemedySubmissionForm />
          </TabsContent>

          <TabsContent value="herb">
            <HerbSubmissionForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function RemedySubmissionForm() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    remedy_name: "",
    primary_herb_name: "",
    herbs_used: "",
    health_condition: "",
    preparation_method: "",
    dosage: "",
    duration_of_use: "",
    observed_effects: "",
    submitter_name: "",
    submitter_contact: ""
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [aiModerating, setAiModerating] = useState(false);
  const [moderationResult, setModerationResult] = useState(null);
  const [submissionComplete, setSubmissionComplete] = useState(false);

  const createRemedyMutation = useMutation({
    mutationFn: (remedyData) => base44.entities.Remedy.create(remedyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remedies'] });
    },
  });

  const createRemedySubmissionMutation = useMutation({
    mutationFn: (submissionData) => base44.entities.RemedySubmission.create(submissionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remedy-submissions'] });
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setUploadedImage(file_url);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image. Please try again.");
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAiModerating(true);

    try {
      const moderationResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `As an expert herbalist, pharmacologist, and medical safety validator with access to current scientific databases, perform a comprehensive analysis of this herbal remedy submission:

Remedy Name: ${formData.remedy_name}
Primary Herb: ${formData.primary_herb_name}
Other Herbs Used: ${formData.herbs_used}
Health Condition: ${formData.health_condition}
Preparation Method: ${formData.preparation_method}
Dosage: ${formData.dosage}
Duration of Use: ${formData.duration_of_use}
Observed Effects: ${formData.observed_effects}

TASK 1 - SAFETY VALIDATION:
Evaluate scientific credibility and safety. Classify the submission as:
- "Approved" if scientifically plausible and safe
- "Flagged - Risk Identified" if concerns exist but may be safe with precautions
- "Rejected" if dangerous or misleading

TASK 2 - COMPREHENSIVE RESEARCH (Use internet context to gather accurate information):
If approved or flagged, compile detailed remedy information including:

1. REMEDY DESCRIPTION: Provide a comprehensive description of this remedy
2. HEALTH BENEFITS: List 3-5 specific health benefits with evidence levels
3. CONDITIONS TREATED: List all health conditions this remedy can address
4. PREPARATION METHODS: Provide detailed preparation instructions
5. DOSAGE GUIDANCE: Provide evidence-based recommended dosages
6. DURATION: Recommended duration of use
7. DRUG INTERACTIONS: List all known drug interactions
8. CONTRAINDICATIONS: List situations/conditions when this remedy should NOT be used
9. SIDE EFFECTS: List potential adverse effects
10. RISK WARNINGS: Specific warnings for this remedy
11. RESEARCH REFERENCES: Provide 2-4 real, verifiable scientific references
12. REGION: Identify primary geographic region
13. CATEGORY: Classify remedy (Adaptogen, Anti-inflammatory, Digestive, Immune Support, etc.)
14. SAFETY RATING: Assign safety rating (Generally Safe, Use with Caution, High Risk - Expert Guidance Required)

Be thorough, evidence-based, and prioritize user safety.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            moderation_status: {
              type: "string",
              enum: ["Approved", "Flagged - Risk Identified", "Rejected"]
            },
            risk_level: {
              type: "string",
              enum: ["Low", "Moderate", "High", "Critical"]
            },
            safety_rating: {
              type: "string",
              enum: ["Generally Safe", "Use with Caution", "High Risk - Expert Guidance Required"]
            },
            credibility_assessment: { type: "string" },
            feedback_summary: { type: "string" },
            remedy_description: { type: "string" },
            region: {
              type: "string",
              enum: ["Africa", "Asia", "Europe", "North America", "South America", "Australia", "Middle East", "Global"]
            },
            category: {
              type: "string",
              enum: ["Adaptogen", "Anti-inflammatory", "Digestive", "Immune Support", "Cardiovascular", "Respiratory", "Nervous System", "Antimicrobial", "Pain Relief", "Skin Health", "Other"]
            },
            conditions_treated: { 
              type: "array", 
              items: { type: "string" } 
            },
            preparation_method_enhanced: { type: "string" },
            dosage_guidance: { type: "string" },
            duration_enhanced: { type: "string" },
            drug_interactions: { 
              type: "array", 
              items: { type: "string" } 
            },
            contraindications: { 
              type: "array", 
              items: { type: "string" } 
            },
            side_effects: { 
              type: "array", 
              items: { type: "string" } 
            },
            risk_warnings: { 
              type: "array", 
              items: { type: "string" } 
            },
            research_references: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  url: { type: "string" },
                  source: { type: "string" }
                }
              }
            },
            expert_review_required: { type: "boolean" }
          }
        }
      });

      setModerationResult(moderationResponse);

      const submissionData = {
        herbs_used: formData.herbs_used ? formData.herbs_used.split(',').map(h => h.trim()) : [formData.primary_herb_name],
        health_condition: formData.health_condition,
        preparation_method: formData.preparation_method,
        dosage: formData.dosage,
        duration_of_use: formData.duration_of_use,
        observed_effects: formData.observed_effects,
        submitter_name: formData.submitter_name,
        submitter_contact: formData.submitter_contact,
        moderation_status: moderationResponse.moderation_status,
        risk_level: moderationResponse.risk_level,
        expert_review_required: moderationResponse.expert_review_required || false,
        ai_feedback: JSON.stringify(moderationResponse)
      };

      await createRemedySubmissionMutation.mutateAsync(submissionData);

      if (moderationResponse.moderation_status === "Approved") {
        const remedyData = {
          name: formData.remedy_name,
          description: moderationResponse.remedy_description || formData.observed_effects,
          primary_herb_name: formData.primary_herb_name,
          herbs_used: formData.herbs_used ? formData.herbs_used.split(',').map(h => h.trim()) : [],
          health_condition: formData.health_condition,
          conditions_treated: moderationResponse.conditions_treated || [formData.health_condition],
          preparation_method: moderationResponse.preparation_method_enhanced || formData.preparation_method,
          dosage: moderationResponse.dosage_guidance || formData.dosage,
          duration_of_use: moderationResponse.duration_enhanced || formData.duration_of_use,
          observed_effects: formData.observed_effects,
          risk_warnings: moderationResponse.risk_warnings || [],
          drug_interactions: moderationResponse.drug_interactions || [],
          contraindications: moderationResponse.contraindications || [],
          side_effects: moderationResponse.side_effects || [],
          safety_rating: moderationResponse.safety_rating || "Use with Caution",
          category: moderationResponse.category || "Other",
          region: moderationResponse.region || "Global",
          research_references: moderationResponse.research_references || [],
          image_url: uploadedImage || "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop",
          submitted_by: formData.submitter_name || "Anonymous",
          approved_by_ai: true,
          featured: false
        };

        await createRemedyMutation.mutateAsync(remedyData);
      }

      setSubmissionComplete(true);

    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit remedy. Please try again.");
    }

    setAiModerating(false);
  };

  if (submissionComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-[#2D5016] mb-4">
            {moderationResult?.moderation_status === "Approved" ? "Published Successfully!" : "Thank You for Your Submission!"}
          </h2>
          
          <div className="mb-6">
            {moderationResult?.moderation_status === "Approved" && (
              <>
                <Badge className="bg-green-500 text-white text-lg px-4 py-2 mb-4">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approved & Published
                </Badge>
                <p className="text-gray-700 mb-4">
                  Your remedy has been validated and is now live on the Explore Remedies page!
                </p>
              </>
            )}
            {moderationResult?.moderation_status === "Flagged - Risk Identified" && (
              <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Safety Concerns Identified
              </Badge>
            )}
            {moderationResult?.moderation_status === "Rejected" && (
              <Badge className="bg-red-500 text-white text-lg px-4 py-2">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Not Approved
              </Badge>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            {moderationResult?.feedback_summary}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button onClick={() => {
              setSubmissionComplete(false);
              setModerationResult(null);
              setUploadedImage(null);
              setFormData({
                remedy_name: "",
                primary_herb_name: "",
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
            {moderationResult?.moderation_status === "Approved" && (
              <Button variant="outline" onClick={() => window.location.href = "/exploreremedies"}>
                View on Explore Page
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-[#2D5016]">Submit a Herbal Remedy</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Remedy Image (Optional)</Label>
            <div className="mt-2">
              {uploadedImage ? (
                <div className="relative">
                  <img src={uploadedImage} alt="Uploaded remedy" className="w-full h-48 object-cover rounded-lg" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setUploadedImage(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="max-w-xs mx-auto"
                  />
                  {uploadingImage && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="remedy_name">Remedy Name *</Label>
            <Input
              id="remedy_name"
              required
              value={formData.remedy_name}
              onChange={(e) => setFormData({...formData, remedy_name: e.target.value})}
              placeholder="e.g., Ginger Tea for Nausea"
              className="mt-2"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="primary_herb">Primary Herb Used *</Label>
              <Input
                id="primary_herb"
                required
                value={formData.primary_herb_name}
                onChange={(e) => setFormData({...formData, primary_herb_name: e.target.value})}
                placeholder="e.g., Ginger"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="herbs_used">Other Herbs (Optional)</Label>
              <Input
                id="herbs_used"
                value={formData.herbs_used}
                onChange={(e) => setFormData({...formData, herbs_used: e.target.value})}
                placeholder="Separate with commas: Lemon, Honey"
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="condition">Health Condition Addressed *</Label>
            <Input
              id="condition"
              required
              value={formData.health_condition}
              onChange={(e) => setFormData({...formData, health_condition: e.target.value})}
              placeholder="e.g., Nausea, Morning sickness"
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
              placeholder="Describe how to prepare this remedy"
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
                placeholder="e.g., 1 cup 2-3 times daily"
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
                placeholder="e.g., As needed, or 3-5 days"
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="effects">Observed Effects & Traditional Uses *</Label>
            <Textarea
              id="effects"
              required
              value={formData.observed_effects}
              onChange={(e) => setFormData({...formData, observed_effects: e.target.value})}
              placeholder="Describe the effects and traditional knowledge about this remedy"
              rows={5}
              className="mt-2"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg text-[#2D5016] mb-4">
              Your Information (Optional)
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={formData.submitter_name}
                  onChange={(e) => setFormData({...formData, submitter_name: e.target.value})}
                  placeholder="Your name (will be shown as contributor)"
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
                  placeholder="Email for follow-up"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              Your submission will be instantly reviewed by AI. Approved remedies are published immediately.
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
                AI is validating and publishing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit & Publish Remedy
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function HerbSubmissionForm() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    common_name: "",
    botanical_name: "",
    local_names: "",
    description: "",
    category: "Other",
    region: "Global",
    health_benefits: "",
    conditions_treated: "",
    preparation_methods: "",
    dosage: "",
    submitter_name: "",
    submitter_contact: ""
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [aiModerating, setAiModerating] = useState(false);
  const [moderationResult, setModerationResult] = useState(null);
  const [submissionComplete, setSubmissionComplete] = useState(false);

  const createHerbMutation = useMutation({
    mutationFn: (herbData) => base44.entities.Herb.create(herbData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['herbs'] });
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setUploadedImage(file_url);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image. Please try again.");
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAiModerating(true);

    try {
      const moderationResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `As an expert herbalist, botanist, and medical safety validator with access to current scientific databases, perform a comprehensive analysis of this herb submission:

Common Name: ${formData.common_name}
Botanical Name: ${formData.botanical_name}
Local Names: ${formData.local_names}
Description: ${formData.description}
Category: ${formData.category}
Region: ${formData.region}
Health Benefits: ${formData.health_benefits}
Conditions Treated: ${formData.conditions_treated}
Preparation Methods: ${formData.preparation_methods}
Dosage: ${formData.dosage}

TASK 1 - SAFETY VALIDATION:
Verify botanical accuracy and safety. Classify as:
- "Approved" if botanically accurate and safe
- "Flagged - Risk Identified" if concerns exist
- "Rejected" if dangerous, inaccurate, or invalid

TASK 2 - COMPREHENSIVE RESEARCH (Use internet context):
If approved or flagged, provide:

1. ENHANCED DESCRIPTION: Comprehensive herb description
2. HEALTH BENEFITS: List with evidence levels (Strong Clinical Evidence, Moderate Evidence, Preliminary Research, Traditional Use)
3. CONDITIONS TREATED: All health conditions this herb addresses
4. PREPARATION METHODS: Detailed methods with instructions
5. DOSAGE: Evidence-based dosage recommendations
6. DRUG INTERACTIONS: All known drug interactions
7. CONTRAINDICATIONS: When NOT to use
8. SIDE EFFECTS: Potential adverse effects
9. MAJOR COMPOUNDS: Key chemical compounds
10. RESEARCH REFERENCES: 2-4 verifiable scientific references
11. SAFETY RATING: (Generally Safe, Use with Caution, High Risk - Expert Guidance Required)

Be thorough and evidence-based.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            moderation_status: {
              type: "string",
              enum: ["Approved", "Flagged - Risk Identified", "Rejected"]
            },
            safety_rating: {
              type: "string",
              enum: ["Generally Safe", "Use with Caution", "High Risk - Expert Guidance Required"]
            },
            feedback_summary: { type: "string" },
            enhanced_description: { type: "string" },
            health_benefits: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  benefit: { type: "string" },
                  evidence_level: { 
                    type: "string",
                    enum: ["Strong Clinical Evidence", "Moderate Evidence", "Preliminary Research", "Traditional Use", "Anecdotal"]
                  }
                }
              }
            },
            conditions_treated: { type: "array", items: { type: "string" } },
            preparation_methods: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  method: { type: "string" },
                  instructions: { type: "string" }
                }
              }
            },
            dosage_guidance: { type: "string" },
            drug_interactions: { type: "array", items: { type: "string" } },
            contraindications: { type: "array", items: { type: "string" } },
            side_effects: { type: "array", items: { type: "string" } },
            major_compounds: { type: "array", items: { type: "string" } },
            research_references: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  url: { type: "string" },
                  source: { type: "string" }
                }
              }
            }
          }
        }
      });

      setModerationResult(moderationResponse);

      if (moderationResponse.moderation_status === "Approved") {
        const herbData = {
          common_name: formData.common_name,
          botanical_name: formData.botanical_name,
          local_names: formData.local_names ? formData.local_names.split(',').map(n => n.trim()) : [],
          description: moderationResponse.enhanced_description || formData.description,
          category: formData.category,
          region: formData.region,
          health_benefits: moderationResponse.health_benefits || [],
          conditions_treated: moderationResponse.conditions_treated || [],
          preparation_methods: moderationResponse.preparation_methods || [],
          dosage: moderationResponse.dosage_guidance || formData.dosage,
          drug_interactions: moderationResponse.drug_interactions || [],
          contraindications: moderationResponse.contraindications || [],
          side_effects: moderationResponse.side_effects || [],
          major_compounds: moderationResponse.major_compounds || [],
          research_references: moderationResponse.research_references || [],
          safety_rating: moderationResponse.safety_rating || "Use with Caution",
          image_url: uploadedImage || "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop",
          submitted_by: formData.submitter_name || "Anonymous",
          community_contributed: true,
          featured: false
        };

        await createHerbMutation.mutateAsync(herbData);
      }

      setSubmissionComplete(true);

    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit herb. Please try again.");
    }

    setAiModerating(false);
  };

  if (submissionComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-[#2D5016] mb-4">
            {moderationResult?.moderation_status === "Approved" ? "Published Successfully!" : "Thank You for Your Submission!"}
          </h2>
          
          <div className="mb-6">
            {moderationResult?.moderation_status === "Approved" && (
              <>
                <Badge className="bg-green-500 text-white text-lg px-4 py-2 mb-4">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approved & Published
                </Badge>
                <p className="text-gray-700 mb-4">
                  Your herb profile has been validated and is now live on the Browse Herbs page!
                </p>
              </>
            )}
            {moderationResult?.moderation_status === "Flagged - Risk Identified" && (
              <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Safety Concerns Identified
              </Badge>
            )}
            {moderationResult?.moderation_status === "Rejected" && (
              <Badge className="bg-red-500 text-white text-lg px-4 py-2">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Not Approved
              </Badge>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            {moderationResult?.feedback_summary}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button onClick={() => {
              setSubmissionComplete(false);
              setModerationResult(null);
              setUploadedImage(null);
              setFormData({
                common_name: "",
                botanical_name: "",
                local_names: "",
                description: "",
                category: "Other",
                region: "Global",
                health_benefits: "",
                conditions_treated: "",
                preparation_methods: "",
                dosage: "",
                submitter_name: "",
                submitter_contact: ""
              });
            }}>
              Submit Another Herb
            </Button>
            {moderationResult?.moderation_status === "Approved" && (
              <Button variant="outline" onClick={() => window.location.href = "/exploreherbs"}>
                View on Browse Herbs
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-[#2D5016]">Submit an Herb Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Herb Image (Optional)</Label>
            <div className="mt-2">
              {uploadedImage ? (
                <div className="relative">
                  <img src={uploadedImage} alt="Uploaded herb" className="w-full h-48 object-cover rounded-lg" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setUploadedImage(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="max-w-xs mx-auto"
                  />
                  {uploadingImage && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="common_name">Common Name *</Label>
              <Input
                id="common_name"
                required
                value={formData.common_name}
                onChange={(e) => setFormData({...formData, common_name: e.target.value})}
                placeholder="e.g., Turmeric"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="botanical_name">Botanical Name *</Label>
              <Input
                id="botanical_name"
                required
                value={formData.botanical_name}
                onChange={(e) => setFormData({...formData, botanical_name: e.target.value})}
                placeholder="e.g., Curcuma longa"
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="local_names">Local/Alternative Names (Optional)</Label>
            <Input
              id="local_names"
              value={formData.local_names}
              onChange={(e) => setFormData({...formData, local_names: e.target.value})}
              placeholder="Separate with commas: Haldi, Indian Saffron"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Provide a general description of this herb"
              rows={4}
              className="mt-2"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="mt-2 w-full border rounded-md p-2"
              >
                <option value="Adaptogen">Adaptogen</option>
                <option value="Anti-inflammatory">Anti-inflammatory</option>
                <option value="Digestive">Digestive</option>
                <option value="Immune Support">Immune Support</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Respiratory">Respiratory</option>
                <option value="Nervous System">Nervous System</option>
                <option value="Antimicrobial">Antimicrobial</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Skin Health">Skin Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="region">Primary Region *</Label>
              <select
                id="region"
                required
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
                className="mt-2 w-full border rounded-md p-2"
              >
                <option value="Africa">Africa</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="North America">North America</option>
                <option value="South America">South America</option>
                <option value="Australia">Australia</option>
                <option value="Middle East">Middle East</option>
                <option value="Global">Global</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="health_benefits">Health Benefits</Label>
            <Textarea
              id="health_benefits"
              value={formData.health_benefits}
              onChange={(e) => setFormData({...formData, health_benefits: e.target.value})}
              placeholder="Describe the health benefits of this herb"
              rows={3}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="conditions">Conditions Treated</Label>
            <Input
              id="conditions"
              value={formData.conditions_treated}
              onChange={(e) => setFormData({...formData, conditions_treated: e.target.value})}
              placeholder="Separate with commas: Inflammation, Digestive issues"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="prep_methods">Preparation Methods</Label>
            <Textarea
              id="prep_methods"
              value={formData.preparation_methods}
              onChange={(e) => setFormData({...formData, preparation_methods: e.target.value})}
              placeholder="Describe how to prepare this herb (e.g., tea, tincture, powder)"
              rows={3}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="herb_dosage">Recommended Dosage</Label>
            <Input
              id="herb_dosage"
              value={formData.dosage}
              onChange={(e) => setFormData({...formData, dosage: e.target.value})}
              placeholder="e.g., 1-3g daily as powder"
              className="mt-2"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg text-[#2D5016] mb-4">
              Your Information (Optional)
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="herb_submitter_name">Your Name</Label>
                <Input
                  id="herb_submitter_name"
                  value={formData.submitter_name}
                  onChange={(e) => setFormData({...formData, submitter_name: e.target.value})}
                  placeholder="Your name (will be shown as contributor)"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="herb_submitter_contact">Contact (Optional)</Label>
                <Input
                  id="herb_submitter_contact"
                  type="email"
                  value={formData.submitter_contact}
                  onChange={(e) => setFormData({...formData, submitter_contact: e.target.value})}
                  placeholder="Email for follow-up"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              Your submission will be validated by AI. Approved herbs are published immediately with research-backed information.
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
                AI is validating and publishing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit & Publish Herb
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}