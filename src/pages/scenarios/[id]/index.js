"use client";
import { Button } from "@/components/ui/button";
import {
  Gantt,
  GanttContent,
  GanttFooter,
  GanttHeader,
} from "@/components/ui/gantt";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function ScenarioDetail() {
  const [schedules, setSchedules] = useState([]);
  const [sort, setSort] = useState("tool");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    fetch(
      `http://${process.env.NEXT_PUBLIC_APS_SERVER}:8080/api/scenarios/${id}/simulate`
    )
      .then((response) => response.json())
      .then((json) => setSchedules(json.schedules));
  }, [id]);

  if (!id || schedules.length === 0) return <div>로딩중</div>;

  const groupIds = [];
  schedules.forEach((one) => {
    if (sort === "job") {
      if (!groupIds.includes(one.jobId)) groupIds.push(one.jobId);
    } else {
      if (!groupIds.includes(one.toolId)) groupIds.push(one.toolId ?? "");
    }
  });

  const groups = groupIds.map((id) => {
    if (sort === "job") {
      return {
        id: id,
        title: id,
        tasks: schedules
          .filter((one) => one.jobId === id)
          .map((one) => ({ ...one, name: one.taskName }))
          .sort((a, b) => a.taskSeq - b.taskSeq),
      };
    } else {
      return {
        id: id,
        title: id,
        tasks: schedules
          .filter((one) => one.toolId === id)
          .map((one) => ({ ...one, name: one.taskName }))
          .sort((a, b) => a.seq - b.seq),
      };
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div>
        <Button variant="ghost" size="sm" onClick={() => setSort("job")}>
          작업
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setSort("tool")}>
          툴
        </Button>
      </div>
      <Gantt
        options={{
          title: "Gantt (shadcn skin)",
          showHeader: true,
        }}
      >
        <GanttHeader />
        <GanttContent data={groups} />
        <GanttFooter />
      </Gantt>
    </div>
  );
}
