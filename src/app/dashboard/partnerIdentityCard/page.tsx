import { PartnerIdentityCard } from "@/components/PartnerIdentityCard";

export const dummyUserData = {
  name: "Ritik Kumar", //
  username: "AMZ260305789", // Follows the Amaze ID format
  mobile: "9876543210", 
  joiningDate: "March 05, 2026", // Current session date
  sponsorName: "Diksha Kumari", //
  sponsorId: "AMZ251100123", //
  photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300", 
  designation: "Independent Associate", //
  businessLevel: "Level 1", // For the 15-level payout system
  rank: "Bronze Partner" 
};
export default function OnboardingPreview() {
  return (
    <div>
      
      {/* Test the ID Card */}
      <PartnerIdentityCard />
    </div>
  );
}