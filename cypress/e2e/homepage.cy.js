
describe("Homepage", () => {
  it("loads the starter page", () => {
    cy.visit("/");
    cy.contains("h1", "AttributionBuilder").should("be.visible");
  });

  it("Works for Pressbooks", () => {
    cy.getByTestId("targetURL").type("https://ecampusontario.pressbooks.pub/fanshaweoerdesignstudio/");
    cy.intercept("post", "https://fetcher-production-8123.up.railway.app*").as("fetcherRequest");
    cy.getByTestId("loadPageBtn").click();
    cy.wait("@fetcherRequest").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
    cy.getByTestId("resultTxt").should("be.visible");
    cy.getByTestId("resultTxt").invoke("val").then((text) => {
      expect(text).to.equal(`"<a href='https://ecampusontario.pressbooks.pub/fanshaweoerdesignstudio/'>The Journey to Open</a>" from <a href='https://ecampusontario.pressbooks.pub/fanshaweoerdesignstudio'>The Journey to Open</a> by Shauna Roch & Andrew Stracuzzi is licensed under a <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/'>Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>, except where otherwise noted.`);
    });
  });

  it("Works for OpenStax", () => {
    cy.getByTestId("targetURL").clear().type("https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-1-real-numbers-algebra-essentials");
    cy.intercept("post", "https://fetcher-production-8123.up.railway.app*").as("fetcherRequest");
    cy.getByTestId("loadPageBtn").click();
    cy.wait("@fetcherRequest").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
    cy.getByTestId("resultTxt").should("be.visible");
    cy.getByTestId("resultTxt").invoke("val").then((text) => {
      expect(text).to.equal(`"<a href='https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-1-real-numbers-algebra-essentials'>1.1 Real Numbers: Algebra Essentials</a>" from <a href='https://openstax.org/details/books/algebra-and-trigonometry-2e'>Algebra and Trigonometry 2e</a> by Jay Abramson is licensed under a <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/'>Creative Commons Attribution-NonCommercial-ShareAlike 4.0 (CC BY NC-SA) license</a>, except where otherwise noted.`);
    });
  });

  it("Works for LibreTexts", () => {
    cy.getByTestId("targetURL").clear().type("https://math.libretexts.org/Courses/Angelo_State_University/Finite_Mathematics/01%3A_Algebra_Essentials/1.01%3A_Real_Numbers_-_Algebra_Essentials");
    cy.intercept("post", "https://fetcher-production-8123.up.railway.app*").as("fetcherRequest");
    cy.getByTestId("loadPageBtn").click();
    cy.wait("@fetcherRequest").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
    cy.getByTestId("resultTxt").should("be.visible");
    cy.getByTestId("resultTxt").invoke("val").then((text) => {
      expect(text).to.equal(`"<a href='https://math.libretexts.org/Courses/Angelo_State_University/Finite_Mathematics/01%3A_Algebra_Essentials/1.01%3A_Real_Numbers_-_Algebra_Essentials'>1.1: Real Numbers - Algebra Essentials</a>" from <a href='https://math.libretexts.org/Courses/Angelo_State_University/Finite_Mathematics/'>Finite Mathematics</a> by LibreTexts is licensed under a <a href='https://creativecommons.org/licenses/by/4.0'>Creative Commons Attribution 4.0 International License</a>, except where otherwise noted.`);
    });
  });

  it("Works for YouTube", () => {
    cy.getByTestId("targetURL").clear().type("https://www.youtube.com/watch?v=EwTZ2xpQwpA&list=RDEwTZ2xpQwpA&start_radio=1");
    cy.intercept("post", "https://fetcher-production-8123.up.railway.app*").as("fetcherRequest");
    cy.getByTestId("loadPageBtn").click();
    cy.wait("@fetcherRequest").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
    cy.getByTestId("resultTxt").should("be.visible");
    cy.getByTestId("resultTxt").invoke("val").then((text) => {
      expect(text).to.equal(`<p>Video: "<a href="https://www.youtube.com/watch?v=EwTZ2xpQwpA&list=RDEwTZ2xpQwpA&start_radio=1">"Chocolate Rain" Original Song by Tay Zonday</a>" by <a href="https://www.youtube.com/channel/UCjMWn75PwKgutJQ0J3mrLbA">TayZonday</a> [4:53] is licensed under the <a href="https://www.youtube.com/static?template=terms">Standard YouTube License</a>.<em>Transcript and closed captions available on YouTube.</em></p>`);
    });
  });
});


