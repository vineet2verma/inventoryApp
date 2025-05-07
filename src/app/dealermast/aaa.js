
{/* Items Preview Table */ }
{/* {itemData.length >= 0 && (
              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Added Items</h3>
                <div className="overflow-auto">
                  <table className="w-full text-sm text-left border">
                    <thead className="bg-gray-100">
                      <tr>
                        {["Design", "Company", "Batch", "Size", "Qty", "Price", "Tag", "Action"].map((h, i) => (
                          <th key={i} className="px-3 py-2 border">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {itemData.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="px-3 py-1 border">{item.designname}</td>
                          <td className="px-3 py-1 border">{item.coname}</td>
                          <td className="px-3 py-1 border">{item.batchno}</td>
                          <td className="px-3 py-1 border">{item.size}</td>
                          <td className="px-3 py-1 border">{item.qty}</td>
                          <td className="px-3 py-1 border">{item.priceperbox}</td>
                          <td className="px-3 py-1 border">{item.outtag}</td>
                          <td className="px-3 py-1 border">
                            <button
                              onClick={() => handleDelete(idx)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )} */}

{/* </form> */ }