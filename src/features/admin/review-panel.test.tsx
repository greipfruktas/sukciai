import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ReviewPanel } from "./review-panel";

it("shows every draft sentence beside its supporting source", () => {
  render(
    <ReviewPanel
      draft={{
        title: "Pradėtas tyrimas dėl savivaldybės išlaidų",
        status: "Pradėtas tyrimas",
        reasons: ["SENSITIVE_STATUS"],
        claims: [{
          text: "Prokuratūra pradėjo tyrimą.",
          quote: "pradėtas ikiteisminis tyrimas",
          sourceTitle: "Prokuratūros pranešimas",
          sourceUrl: "https://prokuraturos.lt/pranesimas",
        }],
      }}
    />,
  );

  expect(screen.getByRole("heading", { name: /pradėtas tyrimas dėl/i })).toBeVisible();
  expect(screen.getByText("Prokuratūra pradėjo tyrimą.")).toBeVisible();
  expect(screen.getByRole("link", { name: "Prokuratūros pranešimas" })).toHaveAttribute(
    "href",
    "https://prokuraturos.lt/pranesimas",
  );
  expect(screen.getByText("SENSITIVE_STATUS")).toBeVisible();
});
