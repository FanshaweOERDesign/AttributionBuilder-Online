var pageURL;
var useCustomInput = false;
const parser = new DOMParser();
var doc;

// data type that holds necessary info for attribution
class Attribution {
    constructor(pageURL, pageTitle, bookURL, bookTitle, author, licenseURL, licenseType) {
        this.pageURL = pageURL;
        this.pageTitle = pageTitle;
        this.bookURL = bookURL;
        this.bookTitle = bookTitle;
        this.author = author;
        this.licenseURL = licenseURL;
        this.licenseType = licenseType;
    }
}

class VideoAttribution {
    constructor(videoURL, videoTitle, channelURL, channelTitle, videoDuration) {
        this.videoURL = videoURL;
        this.videoTitle = videoTitle;
        this.channelURL = channelURL;
        this.channelTitle = channelTitle;
        this.videoDuration = videoDuration;
    }
}

// get page from resource and load it
async function loadTargetPage() {
    // calls function to remove copied message background (in case you click Build Attribution after copying)
    clearCopiedMsg();
    if (useCustomInput) {
        buildAttribution();
        return;
    }
    doc = null;
    let inputDiv = document.getElementById("customInputDiv");
    const loadingDiv = document.getElementById("loading-dots");
    const outputDiv = document.getElementById("outputDiv");
    const errorDiv = document.getElementById("error");
    loadingDiv.style.display = "block";
    outputDiv.style.display = "none";
    errorDiv.style.display = "none";
    document.getElementById("resultTxtCopyRes").innerHTML = "";
    pageURL = document.getElementById("targetURL").value;
    console.log(pageURL);

    // note that the page is being fetched through the allorigins proxy server API
    // to get around CORS being disabled on the target server
    if (!isYouTubeVideo()) {
        try {
            const response = await fetch("https://fetcher-production-8123.up.railway.app/bookData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bookURL: pageURL }), // Sending the bookURL in the request body
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json();
            doc = parser.parseFromString(result.data, "text/html");
            buildAttribution();
        } catch (error) {
            errorDiv.innerText = "Something went wrong. Please try again.";
            errorDiv.style.display = "block";
            loadingDiv.style.display = "none";
            console.log(`Error: ${error}`);
        }
    } else {
        console.log("It's a YouTube video!");
        let lastSlash = pageURL.lastIndexOf("/");
        let hasDot = pageURL.includes("youtu.be");
        let hasInterro = pageURL.includes("?");
        let idStart = pageURL.indexOf("v=") + 2;
        let ytID;
        if (lastSlash === pageURL.length - 1) {
            let truncPageURL = pageURL.substring(0, lastSlash);
            ytID = hasDot ? truncPageURL.substring(truncPageURL.lastIndexOf("/") + 1, hasInterro ? truncPageURL.indexOf("?") : null) : truncPageURL.substring(idStart);
        } else {
            ytID = hasDot ? pageURL.substring(lastSlash + 1, hasInterro ? pageURL.indexOf("?") : null) : pageURL.substring(idStart);
        }
        // This API key is restricted to this domain and will only work for YouTube video data
        fetch(`https://www.googleapis.com/youtube/v3/videos?id=${ytID}&key=AIzaSyDtSVJTrY58QpW8xf3tO72OoHz-drJFlyI&part=snippet,contentDetails`)
            .then((response) => {
                if (response.ok) return response.json();
                throw new Error("Network response was not ok.");
            })
            .then((data) => {
                console.info("Video data: %o", data);
                buildAttribution(data);
            })
            .catch((error) => {
                errorDiv.innerText = "Something went wrong. Please try again.";
                errorDiv.style.display = "block";
                loadingDiv.style.display = "none";
                console.log(`Error: ${error}`);
            });
    }
}

function isPressbooks() {
    if (!doc) {
        return false;
    }
    var elements = doc.getElementsByTagName("*");
    for (let i = 0; i < elements.length; i++) {
        let classes = elements[i].getAttribute("class");

        if (classes && classes.includes("pressbooks")) {
            return true;
        }
    }
    return false;
}

// Create and display attribution for a Pressbooks resource
function getPressbooksAttribution() {
    console.log(pageURL);
    let result = new Attribution(pageURL);
    let metaTags = doc.getElementsByTagName("meta");
    for (let i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute("name") === "citation_title") {
            result.pageTitle = metaTags[i].getAttribute("content");
        } else if (metaTags[i].getAttribute("name") === "citation_book_title") {
            result.bookTitle = metaTags[i].getAttribute("content");
        } else if (metaTags[i].getAttribute("name") === "citation_author") {
            if (!result.author) {
                result.author = metaTags[i].getAttribute("content");
            } else {
                result.author += ", " + metaTags[i].getAttribute("content");
            }
        }
    }

    result.author = result.author.trim();
    const lastComma = result.author.lastIndexOf(",");
    if (lastComma !== -1) {
        result.author = result.author.substring(0, lastComma) + " &" + result.author.substring(lastComma + 1);
    }

    if (pageURL.includes("chapter")) {
        result.bookURL = pageURL.substr(0, pageURL.lastIndexOf("/chapter")) + "/";
    } else {
        result.bookURL = pageURL;
    }

    var anchorTags = doc.getElementsByTagName("a");

    for (let i = 0; i < anchorTags.length; i++) {
        if (anchorTags[i].getAttribute("rel") === "cc:attributionURL") {
            result.bookURL = anchorTags[i].getAttribute("href");
            result.bookTitle = anchorTags[i].innerHTML;
            result.bookTitle = result.bookTitle.replaceAll(/[-–—]/g, "-");
        } else if (anchorTags[i].getAttribute("rel") === "license") {
            result.licenseURL = anchorTags[i].getAttribute("href");
            result.licenseType = anchorTags[i].innerHTML;
        }
    }

    if (!result.pageTitle) {
        result.pageTitle = doc.getElementsByTagName("title")[0].innerHTML;
        result.pageTitle = result.pageTitle.substr(0, title.indexOf(result.bookTitle) - 3);
    }

    if (!result.author) {
        var spans = doc.getElementsByTagName("span");

        for (let i = 0; i < spans.length; i++) {
            if (spans[i].getAttribute("property") === "cc:attributionName") {
                result.author = spans[i].innerHTML;
            }
        }
    }

    return result;
}

// Create and display attribution for an OpenStax resource
function getOpenStaxAttribution() {
    let result = new Attribution(pageURL);
    var pageTitleElement = doc.querySelector('[class^="BookBanner__BookChapter"]');
    result.pageTitle = pageTitleElement.innerText;
    console.log(result.pageTitle);

    var bookTitleElement = doc.querySelector('[class^="BookBanner__BookTitleLink"]');
    result.bookTitle = bookTitleElement.innerText;
    result.bookURL = "https://openstax.org" + bookTitleElement.getAttribute("href");
    console.log(result.bookTitle + " " + result.bookURL);

    var licenseElement = doc.querySelector('[data-html="copyright"] > a');
    result.licenseType = licenseElement.innerText;
    result.licenseURL = licenseElement.getAttribute("href");
    console.log(result.licenseType + " " + result.licenseURL);

    result.author = "<a href='https://openstax.org/'>OpenStax - Rice University</a>";

    return result;
}

function getLibreTextAtrribution() {
    function getLibreBookURL() {
        const temp = pageURL.split("/");
        temp.pop();
        temp.pop();
        return temp.join("/") + "/";
    }

    function parseLibrePageTags() {
        const pageTags = doc.querySelector("#pageTagsHolder");
        const tagsArray1 = JSON.parse(pageTags.innerText);
        const tagsArray2 = tagsArray1.map((tag) => {
            const tagParts = tag.split(/:|@/);
            return {
                name: tagParts[0],
                value: tagParts[1],
            };
        });
        return tagsArray2;
    }

    function formatLibreLicense(licenseTag, licenseVersionTag) {
        let licenseText = licenseTag.value;
        const licenseVersion = licenseVersionTag.value;
        const shortToLong = {
            ["by"]: "Attribution",
            ["nc"]: "NonCommercial",
            ["nd"]: "NoDerivatives",
            ["sa"]: "ShareAlike",
            ["cc"]: "Creative Commons",
        };
        let convertedLicenseText = "";
        for (let i = 0; i < licenseText.length; i += 2) {
            let part = licenseText.substring(i, i + 2).trim();
            if (shortToLong[part]) {
                convertedLicenseText += shortToLong[part] + (i > 0 ? "-" : " ");
            } else {
                convertedLicenseText += part + "-";
            }
        }

        if (convertedLicenseText.endsWith("-")) {
            convertedLicenseText = convertedLicenseText.slice(0, -1);
        }

        const formattedLicenseVersion = licenseVersion.substring(0, 1) + "." + licenseVersion.substring(1);

        return convertedLicenseText + " " + formattedLicenseVersion + " International License";
    }

    let result = new Attribution(pageURL);
    const pageTitleElement = doc.querySelector("#titleHolder");
    result.pageTitle = pageTitleElement.innerText;
    const bookTitleElement = doc.querySelector("#parentParentTitleHolder");
    result.bookTitle = bookTitleElement.innerText;
    result.bookURL = getLibreBookURL();
    const pageTags = parseLibrePageTags();
    const licenseTag = pageTags.find((tag) => tag.name === "license");
    const licenseVersionTag = pageTags.find((tag) => tag.name === "licenseversion");
    const authorTag = pageTags.find((tag) => tag.name === "author");
    const autoAttrElement = doc.querySelector(".autoattribution");
    const autoAttrAnchors = autoAttrElement.querySelectorAll("a");
    const licenseURL = Array.from(autoAttrAnchors)
        .find((anchor) => anchor.getAttribute("href")?.includes("creativecommons.org"))
        ?.getAttribute("href");
    result.licenseURL = licenseURL;
    result.licenseType = formatLibreLicense(licenseTag, licenseVersionTag);
    result.author = authorTag.value;

    return result;
}

function getCustomAttribution() {
    let result = new Attribution(document.getElementById("pageURL").value, document.getElementById("pageTitle").value, document.getElementById("bookURL").value, document.getElementById("bookTitle").value, document.getElementById("author").value, document.getElementById("licenceURL").value, document.getElementById("licenceType").value);
    useCustomInput = false;
    return result;
}
/**
 * Checks if the provided URL is a valid YouTube video URL.
 * @return {string|null} - The YouTube video ID if the URL is valid, otherwise null.
 */
function isYouTubeVideo() {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|user\/(?:[^#&?]+).+|(?:[^#&?]+\/)?v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return pageURL.match(regExp);
}

function isLibreText() {
    if (!doc) {
        return false;
    }
    const urlMetaTag = doc.querySelector('meta[property="og:url"]');
    return urlMetaTag && urlMetaTag.getAttribute("content").includes("libretexts.org");
}

function buildAttribution(data) {
    let attribution;
    let outTxt = document.getElementById("resultTxt");
    let targetURL = document.getElementById("targetURL").value;
    let inputDiv = document.getElementById("customInputDiv");

    if (!useCustomInput && isPressbooks()) {
        inputDiv.style.display = "none";
        attribution = getPressbooksAttribution();
    } else if (!useCustomInput && targetURL.includes("openstax")) {
        inputDiv.style.display = "none";
        attribution = getOpenStaxAttribution();
    } else if (!useCustomInput && isLibreText()) {
        inputDiv.style.display = "none";
        attribution = getLibreTextAtrribution();
    } else if (!useCustomInput && isYouTubeVideo()) {
        console.log("Is YouTube! Line 215");
        const attribution = getVideoAttribution(data);
        const output = `<p>Video: "<a href="${attribution.videoURL}">${attribution.videoTitle}</a>" by <a href="${attribution.channelURL}">${attribution.channelTitle}</a> [${attribution.duration}] is licensed under the <a href="https://www.youtube.com/static?template=terms">Standard YouTube License</a>.<em>Transcript and closed captions available on YouTube.</em></p>`;
        document.getElementById("loading-dots").style.display = "none";
        document.getElementById("error").style.display = "none";
        document.getElementById("outputDiv").style.display = "block";
        outTxt.value = output;
        return;
    } else {
        useCustomInput = true;
        document.getElementById("loading-dots").style.display = "none";
        document.getElementById("error").style.display = "none";
        if (inputDiv.style.display == "block") {
            attribution = getCustomAttribution();
        } else {
            inputDiv.style.display = "block";
            return;
        }
    }
    outTxt.value = `"<a href='${attribution.pageURL}'>${attribution.pageTitle}</a>" from <a href='${attribution.bookURL}'>${attribution.bookTitle}</a> by ${attribution.author} is licensed under a <a href='${attribution.licenseURL}'>${attribution.licenseType}</a>, except where otherwise noted.`;
    console.log(attribution);
    document.getElementById("loading-dots").style.display = "none";
    document.getElementById("error").style.display = "none";
    document.getElementById("outputDiv").style.display = "block";
}

/**
 * Extracts video details from the fetched data.
 * @return {Object} - An object containing video attribution details.
 */
function getVideoAttribution(data) {
    // const title = doc.querySelector('meta[name="title"]').getAttribute('content');
    // const channel = doc.querySelector('link[itemprop="name"]').getAttribute('content');
    // const channelUrl = doc.querySelector('span[itemprop="author"] link[itemprop="url"]').getAttribute('href');
    // const durationMeta = doc.querySelector('meta[itemprop="duration"]').getAttribute('content');
    // const duration = formatDuration(durationMeta);
    const title = data.items[0].snippet.title;
    const channel = data.items[0].snippet.channelTitle;
    const channelUrl = `https://www.youtube.com/channel/${data.items[0].snippet.channelId}`;
    const duration = formatDuration(data.items[0].contentDetails.duration);

    const attribution = new VideoAttribution();
    attribution.videoURL = pageURL;
    attribution.videoTitle = title;
    attribution.channelTitle = channel;
    attribution.channelURL = channelUrl;
    attribution.duration = duration;

    return attribution;
}
/**
 * Formats the video duration from ISO 8601 duration format to "MM:SS" format.
 * @param {string} duration - The ISO 8601 duration string (e.g., "PT5M19S").
 * @return {string} - The formatted duration string (e.g., "5:19").
 */
function formatDuration(duration) {
    const match = duration.match(/PT(\d+M)?(\d+S)?/);
    const minutes = match[1] ? match[1].replace("M", "") : "0";
    const seconds = match[2] ? match[2].replace("S", "") : "0";
    return `${minutes}:${seconds.padStart(2, "0")}`;
}

// Copies contents of output textarea to the clipboard
function copy(id) {
    let textarea = document.getElementById(id).value;
    navigator.clipboard.writeText(textarea);
    let resId = id + "CopyRes";
    document.getElementById(resId).style.display = "block";
    document.getElementById(resId).innerHTML = "Copied!";
}

function startup() {
    document.getElementById("targetURL").addEventListener("keyup", (e) => {
        if (e.key == "Enter") {
            loadTargetPage();
        }
    });
}

// sets copyresult div back to it's default e.g. none.
function clearCopiedMsg() {
    document.getElementById("resultTxtCopyRes").style.display = "";
}
