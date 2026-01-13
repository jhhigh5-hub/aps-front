import { getTools, postTools } from "@/api/tool-api";
import { DataGrid } from "@/components/data-grid/data-grid";
import { useDataGrid } from "@/hooks/use-data-grid";
import { useEffect, useState } from "react";

export default function ToolsPage() {
  const [data, setData] = useState([]);
  const columns = [
    {
      id: "id",
      accessorKey: "id",
      header: "Tool ID",
      minSize: 180,
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Tool Name",
      minSize: 180,
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      minSize: 380,
    },
    {
      id: "difficulty",
      accessorKey: "difficulty",
      header: "Difficulty",
      meta: {
        cell: {
          variant: "select",
          options: [
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
          ],
        },
      },
    },
  ];
  const onRowAdd = function () {
    setData((prev) => [...prev, { id: data.length + 1 }]);

    return {
      rowIndex: data.length,
      columnId: "trickName",
    };
  };

  const { table, ...dataGridProps } = useDataGrid({
    data,
    columns,
    onRowAdd,
    onDataChange: setData,
    getRowId: (row) => row.id,
  });

  const upsertBtHandle = function () {
    postTools(data);
  };

  // 데이터 로드
  useEffect(function () {
    getTools().then((json) => {
      setData(json.tools);
    });
  }, []);

  return (
    <>
      <div className="text-end border">
        <button onClick={upsertBtHandle}>저장</button>
      </div>
      <DataGrid table={table} {...dataGridProps} />
    </>
  );
}
