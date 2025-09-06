import React from 'react'
import StatsCount from "../components/ui/statscount";
function Section5() {
    const stats = [
        { value: 300, suffix: "+", label: "employers hiring from our platform" },
        { value: 2.5, suffix: "K+", label: "verified certificates issued" },
        { value: 80, suffix: "%", label: "employers hiring from our platform" },
      ];
  return (
    <div>
        <StatsCount
      stats={stats}
      title="Join thousands of learners and employers already transforming their future with AI-powered career insights and blockchain-secured certifications."
      showDividers={true}
      className=""
    />
    </div>
  )
}

export default Section5