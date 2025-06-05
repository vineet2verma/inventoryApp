// components/Card.js
export default function InfoCard({ title, sections, width = "w-full max-w-md", border="border"  }) {
  return (
    <div className={`bg-white ${border} rounded-2xl shadow p-3 ${width}  `}>
      <h2 className=" font-bold mb-2">{title || "_"}</h2>
      <div className="grid grid-rows-2 gap-2 overflow-hidden ">
        {sections.map((section, index) => (
          <div key={index} className="grid grid-cols-1">
            <h3 className="text-xs font-semibold ">{section.subtitle}</h3>
            <p className="text-xs text-gray-800">{section.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
