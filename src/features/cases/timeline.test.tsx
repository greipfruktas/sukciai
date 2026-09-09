import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Timeline } from "./timeline";

it("orders the newest documented event first", () => {
  render(
    <Timeline
      events={[
        { date: "2025-02-01", title: "Pradėtas tyrimas", sourceUrl: "/saltinis/1" },
        { date: "2026-04-03", title: "Paskelbtas sprendimas", sourceUrl: "/saltinis/2" },
      ]}
    />,
  );

  const events = screen.getAllByRole("listitem");
  expect(events[0]).toHaveTextContent("Paskelbtas sprendimas");
  expect(events[1]).toHaveTextContent("Pradėtas tyrimas");
});
