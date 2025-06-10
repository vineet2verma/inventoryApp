// components/Card.js
export default function InfoCard({
  title,
  sections,
  width = "w-full max-w-md",
  border = "border",
}) {
  return (
    <div className={`bg-white ${border} rounded-2xl shadow p-3 ${width}  `}>
      <h2 className=" font-bold mb-2">{title || "_"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-hidden ">
        {sections.map((section, index) => (
          <div key={index} className="grid gap-1 text-xs">
            {Object.entries(section).map(([key, value]) => (
              <div key={key} className="grid grid-cols-1 gap-1">
                <span className="font-semibold capitalize">{key}:</span>
                <span className="text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
