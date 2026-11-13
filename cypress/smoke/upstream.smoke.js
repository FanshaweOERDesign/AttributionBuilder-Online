describe("Upstream Schema Smoke Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Works for Pressbooks (Live Schema)", () => {
    cy.get("#targetURL").type("https://ecampusontario.pressbooks.pub/fanshaweoerdesignstudio/chapter/history-of-open-at-fanshawe/");
    cy.get("#loadPageBtn").click();

    // Cypress automatically waits up to 30 seconds for #resultTxt to become visible and match
    cy.get("#resultTxt", { timeout: 30000 })
      .should("be.visible")
      .invoke("val")
      .should(
        "equal",
        `"<a href='https://ecampusontario.pressbooks.pub/fanshaweoerdesignstudio/chapter/history-of-open-at-fanshawe/'>History of Open at Fanshawe </a>" from <a href='https://ecampusontario.pressbooks.pub/fanshaweoerdesignstudio'>The Journey to Open</a> by Shauna Roch & Andrew Stracuzzi is licensed under a <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/'>Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>, except where otherwise noted.`
      );
  });

    it("Works for OpenStax (Live Schema)", () => {
    cy.get("#targetURL").clear().type("https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-1-real-numbers-algebra-essentials");
    cy.get("#loadPageBtn").click();
    cy.get("#resultTxt", { timeout: 30000 }).should("be.visible");
    cy.get("#resultTxt").invoke("val")
      .should(
        "equal",
        `"<a href='https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-1-real-numbers-algebra-essentials'>1.1 Real Numbers: Algebra Essentials</a>" from <a href='https://openstax.org/details/books/algebra-and-trigonometry-2e'>Algebra and Trigonometry 2e</a> by Jay Abramson is licensed under a <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/'>Creative Commons Attribution-NonCommercial-ShareAlike 4.0 (CC BY NC-SA) license</a>, except where otherwise noted.`
      );
  });

    it("Works for LibreTexts (Live Schema)", () => {
    cy.get("#targetURL").clear().type("https://math.libretexts.org/Courses/Angelo_State_University/Finite_Mathematics/01%3A_Algebra_Essentials/1.01%3A_Real_Numbers_-_Algebra_Essentials");
    cy.get("#loadPageBtn").click();
    cy.get("#resultTxt", { timeout: 30000 }).should("be.visible");
    cy.get("#resultTxt").invoke("val")
      .should(
        "equal",
        `"<a href='https://math.libretexts.org/Courses/Angelo_State_University/Finite_Mathematics/01%3A_Algebra_Essentials/1.01%3A_Real_Numbers_-_Algebra_Essentials'>1.1: Real Numbers - Algebra Essentials</a>" from <a href='https://math.libretexts.org/Courses/Angelo_State_University/Finite_Mathematics/'>Finite Mathematics</a> by LibreTexts is licensed under a <a href='https://creativecommons.org/licenses/by/4.0'>Creative Commons Attribution 4.0 International License</a>, except where otherwise noted.`
      );

  });

  it("Works for YouTube (Live Schema)", () => {
    cy.get("#targetURL").clear().type("https://www.youtube.com/watch?v=EwTZ2xpQwpA&list=RDEwTZ2xpQwpA&start_radio=1");
    cy.get("#loadPageBtn").click();

    cy.get("#resultTxt", { timeout: 15000 }).should("be.visible");
    cy.get("#resultTxt").invoke("val")
      .should(
        "equal",
        `<p>Video: "<a href="https://www.youtube.com/watch?v=EwTZ2xpQwpA&list=RDEwTZ2xpQwpA&start_radio=1">"Chocolate Rain" Original Song by Tay Zonday</a>" by <a href="https://www.youtube.com/channel/UCjMWn75PwKgutJQ0J3mrLbA">TayZonday</a> [4:53] is licensed under the <a href="https://www.youtube.com/static?template=terms">Standard YouTube License</a>.<em>Transcript and closed captions available on YouTube.</em></p>`
      );

  });
});