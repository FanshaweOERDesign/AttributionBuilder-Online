
describe("Homepage", () => {
  it("loads the starter page", () => {
    cy.visit("/");
    cy.contains("h1", "AttributionBuilder").should("be.visible");
  });

});


