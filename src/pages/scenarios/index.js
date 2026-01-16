import ScenarioDialog from "@/components/scenario-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScenarioPage() {
  const [scenarios, setScenarios] = useState(null);

  useEffect(() => {
    fetch(`http://${process.env.NEXT_PUBLIC_APS_SERVER}:8080/api/scenarios`)
      .then((resp) => resp.json())
      .then((json) => setScenarios(json.scenario));
  }, []);

  if (!scenarios) {
    return <div>로딩중</div>;
  }

  const updateScenariosStatus = (scenarioId, status) => {
    const changedScenarios = scenarios.map((one) => {
      if (one.id === scenarioId) {
        return { ...one, status: status };
      } else {
        return { ...one };
      }
    });
    setScenarios(changedScenarios);
  };

  const runBtHadle = async (scenarioId) => {
    updateScenariosStatus(scenarioId, "PENDING");
    const response = await fetch(
      `http://${process.env.NEXT_PUBLIC_APS_SERVER}:8080/api/scenarios/${scenarioId}/simulate`,
      {
        method: "post",
      }
    );
    const json = await response.json();
    updateScenariosStatus(scenarioId, json.status);
  };

  return (
    <>
      <ScenarioDialog />
      <Table className="select-none">
        <TableCaption>시나리오 목록</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-40">Scenario Id</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Job Count</TableHead>
            <TableHead className="w-60">Status</TableHead>
            <TableHead className="w-50"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scenarios.map((one) => (
            <TableRow key={one.id} className="h-15">
              <TableCell>{one.id}</TableCell>
              <TableCell>{one.description}</TableCell>
              <TableCell>{one.jobCount}</TableCell>
              <TableCell>{one.status}</TableCell>
              <TableCell>
                {one.status === "READY" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => runBtHadle(one.id)}
                  >
                    <Check size={20} />
                    Run
                  </Button>
                )}
                {one.status === "PENDING" && (
                  <Button variant="ghost" size="sm" disabled>
                    <Spinner />
                    Pending
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
