import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, Loader2, CheckCircle, AlertTriangle, Info, Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";

export default function SubmitRemedy() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    common_name: "",
    botanical_name: "",
    local_names: "",
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

  const createHerbMutation = useMutation({
    mutationFn: (herbData) => base44.entities.Herb.create(herbData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['herbs'] });
      queryClient.invalidateQueries({ queryKey: ['featured-herbs'] });
    },
  });

  const createRemedyMutation = useMutation({
    mutationFn: (remedyData) => base44.entities.RemedySubmission.create(remedyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remedies'] });
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
      // Enhanced AI Moderation with Web Search and Comprehensive Analysis
      const moderationResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `As an expert herbalist, pharmacologist, and medical safety validator with access to current scientific databases, perform a comprehensive analysis of this herbal remedy submission:

Common Name: ${formData.common_name}
Botanical Name: ${formData.botanical_name}
Local Names: ${formData.local_names}
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
If approved or flagged, compile detailed herbal information including:

1. HEALTH BENEFITS: List 3-5 specific health benefits with evidence levels (Strong Clinical Evidence, Moderate Evidence, Preliminary Research, Traditional Use, Anecdotal)

2. CONDITIONS TREATED: List all health conditions this herb can address

3. PREPARATION METHODS: Provide 2-4 traditional and modern preparation methods with detailed instructions

4. DOSAGE GUIDANCE: Provide evidence-based recommended dosages

5. MAJOR CHEMICAL COMPOUNDS: List the key active compounds (e.g., alkaloids, flavonoids, terpenes)

6. DRUG INTERACTIONS: List all known drug interactions and medications that may interact

7. CONTRAINDICATIONS: List situations/conditions when this herb should NOT be used (pregnancy, diseases, etc.)

8. SIDE EFFECTS: List potential adverse effects

9. RESEARCH REFERENCES: Provide 2-4 real, verifiable scientific references with titles, URLs, and sources (PubMed, journals, etc.)

10. REGION: Identify primary geographic region (Africa, Asia, Europe, North America, South America, Australia, Middle East, Global)

11. CATEGORY: Classify herb (Adaptogen, Anti-inflammatory, Digestive, Immune Support, Cardiovascular, Respiratory, Nervous System, Antimicrobial, Pain Relief, Skin Health, Other)

Be thorough, evidence-based, and prioritize user safety. Use actual research when possible.`,
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
            region: {
              type: "string",
              enum: ["Africa", "Asia", "Europe", "North America", "South America", "Australia", "Middle East", "Global"]
            },
            category: {
              type: "string",
              enum: ["Adaptogen", "Anti-inflammatory", "Digestive", "Immune Support", "Cardiovascular", "Respiratory", "Nervous System", "Antimicrobial", "Pain Relief", "Skin Health", "Other"]
            },
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
            conditions_treated: { 
              type: "array", 
              items: { type: "string" } 
            },
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
            major_compounds: { 
              type: "array", 
              items: { type: "string" } 
            },
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
            safety_concerns: { 
              type: "array", 
              items: { type: "string" } 
            },
            potential_interactions: { 
              type: "array", 
              items: { type: "string" } 
            },
            alternative_herbs: { 
              type: "array", 
              items: { type: "string" } 
            },
            expert_review_required: { type: "boolean" }
          }
        }
      });

      setModerationResult(moderationResponse);

      // Save to RemedySubmission for records
      const submissionData = {
        herbs_used: formData.herbs_used ? formData.herbs_used.split(',').map(h => h.trim()) : [formData.common_name],
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

      await createRemedyMutation.mutateAsync(submissionData);

      // If approved, automatically create comprehensive Herb entity
      if (moderationResponse.moderation_status === "Approved") {
        const herbData = {
          common_name: formData.common_name,
          botanical_name: formData.botanical_name,
          local_names: formData.local_names ? formData.local_names.split(',').map(n => n.trim()) : [],
          description: formData.observed_effects,
          image_url: uploadedImage || "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop",
          region: moderationResponse.region || "Global",
          category: moderationResponse.category || "Other",
          health_benefits: moderationResponse.health_benefits || [],
          conditions_treated: moderationResponse.conditions_treated || [formData.health_condition],
          preparation_methods: moderationResponse.preparation_methods || [{
            method: "Traditional Method",
            instructions: formData.preparation_method
          }],
          dosage: moderationResponse.dosage_guidance || formData.dosage,
          drug_interactions: moderationResponse.drug_interactions || [],
          contraindications: moderationResponse.contraindications || [],
          side_effects: moderationResponse.side_effects || [],
          major_compounds: moderationResponse.major_compounds || [],
          research_references: moderationResponse.research_references || [],
          safety_rating: moderationResponse.safety_rating || "Use with Caution",
          featured: false,
          submitted_by: formData.submitter_name || "Anonymous",
          community_contributed: true
        };

        await createHerbMutation.mutateAsync(herbData);
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
      <div className="min-h-screen flex items-center justify-center px-6">
        <Card className="max-w-2xl w-full">
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
                    Your remedy has been validated with comprehensive research data and is now live on the Explore Herbs page!
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
                setUploadedImage(null);
                setFormData({
                  common_name: "",
                  botanical_name: "",
                  local_names: "",
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
                <Button variant="outline" onClick={() => window.location.href = createPageUrl("ExploreHerbs")}>
                  View on Explore Page
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2D5016] mb-4">
            Submit a Herbal Remedy
          </h1>
          <p className="text-lg text-gray-600">
            Share your traditional herbal knowledge. AI instantly validates, researches, and publishes approved remedies with comprehensive details.
          </p>
        </div>

        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>Enhanced AI Publishing!</strong> Our AI searches scientific databases to add research references, chemical compounds, safety information, and evidence-based details before publishing.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[#2D5016]">Remedy Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="common_name">Common Name *</Label>
                <Input
                  id="common_name"
                  required
                  value={formData.common_name}
                  onChange={(e) => setFormData({...formData, common_name: e.target.value})}
                  placeholder="e.g., Ginger, Turmeric"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="botanical_name">Botanical/Scientific Name</Label>
                <Input
                  id="botanical_name"
                  value={formData.botanical_name}
                  onChange={(e) => setFormData({...formData, botanical_name: e.target.value})}
                  placeholder="e.g., Zingiber officinale"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="local_names">Local/Traditional Names (comma-separated)</Label>
                <Input
                  id="local_names"
                  value={formData.local_names}
                  onChange={(e) => setFormData({...formData, local_names: e.target.value})}
                  placeholder="e.g., Isingibibi, Tangawizi"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Herb Image (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                  {uploadingImage && <Loader2 className="w-5 h-5 animate-spin text-[#2D5016]" />}
                </div>
                {uploadedImage && (
                  <div className="relative w-32 h-32">
                    <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setUploadedImage(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="health_condition">Health Condition Treated *</Label>
                <Input
                  id="health_condition"
                  required
                  value={formData.health_condition}
                  onChange={(e) => setFormData({...formData, health_condition: e.target.value})}
                  placeholder="e.g., Common cold, inflammation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preparation_method">Preparation Method *</Label>
                <Textarea
                  id="preparation_method"
                  required
                  value={formData.preparation_method}
                  onChange={(e) => setFormData({...formData, preparation_method: e.target.value})}
                  placeholder="Describe how to prepare this remedy..."
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dosage">Recommended Dosage *</Label>
                  <Input
                    id="dosage"
                    required
                    value={formData.dosage}
                    onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                    placeholder="e.g., 1 teaspoon twice daily"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_of_use">Duration of Use</Label>
                  <Input
                    id="duration_of_use"
                    value={formData.duration_of_use}
                    onChange={(e) => setFormData({...formData, duration_of_use: e.target.value})}
                    placeholder="e.g., 7-10 days"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observed_effects">Observed Effects/Benefits *</Label>
                <Textarea
                  id="observed_effects"
                  required
                  value={formData.observed_effects}
                  onChange={(e) => setFormData({...formData, observed_effects: e.target.value})}
                  placeholder="Describe the effects you or others have observed..."
                  rows={4}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-[#2D5016] mb-4">Your Information</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="submitter_name">Your Name (Optional)</Label>
                    <Input
                      id="submitter_name"
                      value={formData.submitter_name}
                      onChange={(e) => setFormData({...formData, submitter_name: e.target.value})}
                      placeholder="Anonymous"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="submitter_contact">Contact (Optional)</Label>
                    <Input
                      id="submitter_contact"
                      type="email"
                      value={formData.submitter_contact}
                      onChange={(e) => setFormData({...formData, submitter_contact: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={aiModerating}
                className="w-full bg-[#2D5016] hover:bg-[#4A7C2E] text-white"
                size="lg"
              >
                {aiModerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    AI Validating & Researching...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit for AI Validation
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