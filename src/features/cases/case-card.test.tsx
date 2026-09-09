import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { CaseCard } from "./case-card";

it("shows the current status and source count with a case", () => {
  render(
    <CaseCard
      item={{
        slug: "demonstracinis-atvejis",
        title: "Institucija paskelbė galutinį sprendimą",
        summary: "Trumpa patvirtintų faktų santrauka.",
        status: "final_decision",
        statusDate: "2026-09-08",
        municipality: "Kauno m. sav.",
        sourceCount: 3,
      }}
    />,
  );

  expect(screen.getByRole("link", { name: /institucija paskelbė/i })).toHaveAttribute(
    "href",
    "/atvejai/demonstracinis-atvejis",
  );
  expect(screen.getByText("3 šaltiniai")).toBeVisible();
  expect(screen.getByText("Įsiteisėjęs sprendimas")).toBeVisible();
});
