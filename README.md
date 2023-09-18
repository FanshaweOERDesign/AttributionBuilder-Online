# AttributionBuilder

AttributionBuilder composes a standard attribution string for an online OER (**O**pen **E**ducation **R**esource), and is especially geared towards those resources available on the Pressbooks platform or through OpenStax. A [downloadable standalone version](https://github.com/FanshaweOERDesign/AttributionBuilder-Standalone/releases/tag/v1.4) and an [online version](https://fanshaweoerdesign.github.io/AttributionBuilder-Online/) are available. For Pressbooks and OpenStax resources, the AttributionBuider does all the work for you, turning this:

    https://ecampusontario.pressbooks.pub/fanshaweoerdesignstudio/chapter/open-initiative-at-fanshawe-college/

into this:

    "<a href='https://ecampusontario.pressbooks.pub/fanshaweoerdesignstudio/chapter/open-initiative-at-fanshawe-college/'>Open Initiative at Fanshawe College</a>" from <a href='https://ecampusontario.pressbooks.pub/fanshaweoerdesignstudio'>The Journey to Open</a> by Fanshawe College is licensed under a <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/'>Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>, except where otherwise noted.

which displays like this:

>"[Open Initiative at Fanshawe College](https://ecampusontario.pressbooks.pub/fanshaweoerdesignstudio/chapter/open-initiative-at-fanshawe-college/)" from [The Journey to Open](https://ecampusontario.pressbooks.pub/fanshaweoerdesignstudio) by Fanshawe College is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/), except where otherwise noted.

If the AttributionBuilder detects that the resource is neither in Pressbooks nor OpenStax format, it will provide a set of input fields for entering the relevant data manually.

Attributions can be grouped and saved as projects, allowing them to be recalled, edited, and exported to text format.

Note that the output of AttributionBuilder is only as good as the information with which it is provided. Since the information is parsed from the document at the given URL, if this information is inaccurate, then the attribution string produced will be inaccurate also. It's a good practice when using AttributionBuilder with a new resource to pay special attention to the output, to ensure the authors of the resource have provided accurate and complete attribution information.

## Dependencies
- [GSon](https://github.com/google/gson)
- [JSoup](https://jsoup.org)

