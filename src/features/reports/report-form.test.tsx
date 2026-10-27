import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, it } from "vitest";
import { ReportForm } from "./report-form";

beforeEach(() => localStorage.clear());

it("validates the current step before moving forward", () => {
  render(<ReportForm />);
  fireEvent.click(screen.getByRole("button", { name: "Toliau" }));
  expect(screen.getByText("Užpildykite vardą, el. paštą ir telefoną.")).toBeVisible();
  expect(screen.getByText("1 iš 5")).toBeVisible();
});

it("restores a local draft without sending it to the server", () => {
  localStorage.setItem("sukciai-report-draft", JSON.stringify({ reporterName: "Ona Onaitytė", email: "ona@example.lt", phone: "+37061234567" }));
  render(<ReportForm />);
  expect(screen.getByLabelText("Jūsų vardas ir pavardė")).toHaveValue("Ona Onaitytė");
  expect(screen.getByText(/juodraštis saugomas tik šiame įrenginyje/i)).toBeVisible();
});

it("provides an accessible private evidence upload", () => {
  render(<ReportForm />);
  expect(screen.getByLabelText("Įrodymai")).toHaveAttribute("type", "file");
  expect(screen.getByText(/failai nėra viešinami automatiškai/i)).toBeVisible();
});
