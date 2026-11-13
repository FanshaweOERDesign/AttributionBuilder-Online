
describe("Homepage", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("loads the starter page", () => {
    cy.contains("h1", "AttributionBuilder").should("be.visible");
  });

  it("Works for Pressbooks", () => {
    cy.get("#targetURL").type("https://ecampusontario.pressbooks.pub/fanshaweoerdesignstudio/");
    cy.intercept("POST", "https://fetcher-production-8123.up.railway.app/bookData").as("fetcherRequest");
    cy.get("#loadPageBtn").click();
    cy.wait("@fetcherRequest").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
    cy.get("#resultTxt").should("be.visible");
    cy.get("#resultTxt").invoke("val").then((text) => {
      expect(text).to.equal(`"<a href='https://ecampusontario.pressbooks.pub/fanshaweoerdesignstudio/'>The Journey to Open</a>" from <a href='https://ecampusontario.pressbooks.pub/fanshaweoerdesignstudio'>The Journey to Open</a> by Shauna Roch & Andrew Stracuzzi is licensed under a <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/'>Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>, except where otherwise noted.`);
    });
  });

  it("Works for OpenStax", () => {
    cy.get("#targetURL").clear().type("https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-1-real-numbers-algebra-essentials");
    cy.intercept("POST", "https://fetcher-production-8123.up.railway.app/bookData").as("fetcherRequest");
    cy.get("#loadPageBtn").click();
    cy.wait("@fetcherRequest").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
    cy.get("#resultTxt").should("be.visible");
    cy.get("#resultTxt").invoke("val").then((text) => {
      expect(text).to.equal(`"<a href='https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-1-real-numbers-algebra-essentials'>1.1 Real Numbers: Algebra Essentials</a>" from <a href='https://openstax.org/details/books/algebra-and-trigonometry-2e'>Algebra and Trigonometry 2e</a> by Jay Abramson is licensed under a <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/'>Creative Commons Attribution-NonCommercial-ShareAlike 4.0 (CC BY NC-SA) license</a>, except where otherwise noted.`);
    });
  });

  it("Works for LibreTexts", () => {
    cy.get("#targetURL").clear().type("https://math.libretexts.org/Courses/Angelo_State_University/Finite_Mathematics/01%3A_Algebra_Essentials/1.01%3A_Real_Numbers_-_Algebra_Essentials");
    cy.intercept("POST", "https://fetcher-production-8123.up.railway.app/bookData").as("fetcherRequest");
    cy.get("#loadPageBtn").click();
    cy.wait("@fetcherRequest").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
    cy.get("#resultTxt").should("be.visible");
    cy.get("#resultTxt").invoke("val").then((text) => {
      expect(text).to.equal(`"<a href='https://math.libretexts.org/Courses/Angelo_State_University/Finite_Mathematics/01%3A_Algebra_Essentials/1.01%3A_Real_Numbers_-_Algebra_Essentials'>1.1: Real Numbers - Algebra Essentials</a>" from <a href='https://math.libretexts.org/Courses/Angelo_State_University/Finite_Mathematics/'>Finite Mathematics</a> by LibreTexts is licensed under a <a href='https://creativecommons.org/licenses/by/4.0'>Creative Commons Attribution 4.0 International License</a>, except where otherwise noted.`);
    });
  });

  it("Works for YouTube (CI/CD)", () => {
  // Intercept the direct frontend call to Google's YouTube Data API
  cy.intercept("GET", /https:\/\/www\.googleapis\.com\/youtube\/v3\/videos.*/, {
    statusCode: 200,
    body: {
      items: [
        {
          id: "dQw4w9WgXcQ",
          snippet: {
            title: "Sample OER Video Title",
            channelTitle: "Fanshawe OER Design Studio",
          },
          status: {
            // Use "creativeCommon" if your app checks for CC-licensed videos, or "youtube" for standard
            license: "creativeCommon",
          },
        },
      ],
    },
  }).as("youtubeApi");

  cy.get("#targetURL").type("https://www.youtube.com/watch?v=EwTZ2xpQwpA&list=RDEwTZ2xpQwpA&start_radio=1");
  cy.get("#loadPageBtn").click();

  cy.wait("@youtubeApi");

  cy.get("#resultTxt").should("be.visible");
  cy.get("#resultTxt").invoke("val").then((text) => {
    expect(text).to.include("Sample OER Video Title");
    expect(text).to.include("Fanshawe OER Design Studio");
  });
});

});



