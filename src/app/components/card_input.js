// components/Card.js
export default function InfoCardInput({
  id,
  title,
  sections,
  width = "w-full max-w-md",
  border = "border",
  editable = false,
  onChange = () => {},
}) {
  return (
    <div className={`bg-white ${border} rounded-2xl shadow p-3 ${width}`}>
      {/* {console.log("id  ==>>  ", id)} */}
      {/* {console.log(" ==>>  ", sections)} */}

      <h2 className="font-bold mb-2">{title || "_"}</h2>
      <div className="grid grid-rows-2 gap-2 overflow-hidden">
        {sections.map((section, index) => (
          <div key={index} className="grid grid-cols-1">
            <h3 className="text-xs font-semibold">{section.subtitle}</h3>
            {editable ? (
              <input
                type="text"
                value={section.detail}
                onChange={(e) => onChange(index, e.target.value)}
                className="text-xs text-gray-800 border rounded px-1 py-0.5"
              />
            ) : (
              <p className="text-xs text-gray-800">{section.detail}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
