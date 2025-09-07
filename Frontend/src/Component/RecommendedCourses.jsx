// Frontend/src/Component/RecommendedCourses.jsx

import React from 'react';

function RecommendedCourses({ recommendations, loading }) {
  if (loading) {
    return <p className="text-gray-500">Loading recommendations...</p>;
  }
  if (!recommendations || recommendations.length === 0) {
    return <p className="text-gray-500">No recommendations available.</p>;
  }
  return (
    <div className="mt-4 space-y-3">
      {recommendations.map((course, index) => (
        <div key={index} className="p-3 rounded-lg bg-zinc-800">
          <h4 className="font-semibold text-white">{course.title}</h4>
          <p className="text-sm text-gray-400 capitalize">{course.category} - {course.difficulty}</p>
        </div>
      ))}
    </div>
  );
}
export default RecommendedCourses;