// components/Card.js
export default function InfoCardInput({
  id,
  title,
  sections,
  setSections,
  width = "w-full max-w-md",
  border = "border",
  editable = false,
  data,
  setviewdetail,
}) {
  // console.log("previous data",data)
  const handleChange = (index, value, key) => {
    // Clone the current section (e.g. sections[0], sections[1], etc.)
    const updatedSection = [...sections[id]];
    // Update the specific detail
    updatedSection[index] = {
      ...updatedSection[index],
      detail: value,
    };

    // Update the entire sections array with the updated section
    const updatedSections = [...sections];
    updatedSections[id] = updatedSection;

    // Call setSections with the new array
    setSections(updatedSections);
    data[key] = value;
    setviewdetail(data);
    // console.log("updated data",data)
  };

  return (
    <div className={`bg-white ${border} rounded-2xl shadow p-3 ${width}`}>
      <h2 className="font-bold mb-2">{title || "_"}</h2>
      <div className="grid grid-rows-2 gap-2 overflow-hidden">
        {sections[id]?.map((section, index) => (
          <div key={index} className="grid grid-cols-1">
            <h3 className="text-xs font-semibold">{section.subtitle}</h3>
            {editable ? (
              <input
                type="text"
                value={section.detail ?? ""}
                onChange={(e) =>
                  handleChange(index, e.target.value, section.key)
                }
                className="text-xs text-gray-800 border rounded px-1 py-0.5"
              />
            ) : (
              <p className="text-xs text-gray-800">{section.detail ?? "—"}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
