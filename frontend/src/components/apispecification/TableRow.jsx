import { useFormStore } from "../../store/useAPIStore";
import { useProjectListStore } from "../../store/useProjectListStore";

function TableRow({ spec, onUriClick, columnWidths }) {
  const { updateSpec } = useFormStore();
  const { methods, importanceLevels } = useProjectListStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(`Updating spec ${spec.id}: ${name} = ${value}`);
    updateSpec(spec.id, { [name]: value });
  };

  return (
    <tr className="hover:bg-gray-50">
      <td style={{ width: columnWidths[0] }} className="p-2">
        <input
          type="text"
          name="feature"
          value={spec.feature}
          onChange={handleChange}
          className="w-full p-1 focus:outline-none rounded border-b"
        />
      </td>
      <td style={{ width: columnWidths[1] }} className="p-2">
        <input
          type="text"
          name="domain"
          value={spec.domain}
          onChange={handleChange}
          className="w-full p-1 focus:outline-none rounded border-b"
        />
      </td>
      <td style={{ width: columnWidths[2] }} className="p-2">
        <select
          name="method"
          value={spec.method}
          onChange={handleChange}
          className="w-full p-1 focus:outline-none rounded border-b bg-transparent"
        >
          {methods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </td>
      <td
        style={{ width: columnWidths[3] }}
        className="p-2 text-blue-200 cursor-pointer focus:outline-none"
        onClick={() => onUriClick(spec)}
      >
        {spec.uri}
      </td>
      <td style={{ width: columnWidths[4] }} className="p-2">
        <select
          name="importance"
          value={spec.importance}
          onChange={handleChange}
          className="w-full p-1 focus:outline-none rounded border-b bg-transparent"
        >
          {importanceLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </td>
      <td style={{ width: columnWidths[5] }} className="p-2">
        <input
          type="text"
          name="backendOwner"
          value={spec.backendOwner}
          onChange={handleChange}
          className="w-full p-1 focus:outline-none rounded border-b"
        />
      </td>
      <td style={{ width: columnWidths[6] }} className="p-2">
        <input
          type="text"
          name="frontendOwner"
          value={spec.frontendOwner}
          onChange={handleChange}
          className="w-full p-1 focus:outline-none rounded border-b"
        />
      </td>
      <td style={{ width: columnWidths[7] }} className="p-2">
        <input
          name="memo"
          value={spec.memo}
          onChange={handleChange}
          className="w-full p-1 focus:outline-none rounded border-b"
        />
      </td>
    </tr>
  );
}

export default TableRow;
