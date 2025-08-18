const MAIN_COLOR = "#FEFAE0";
const ALT_COLOR = "transparent";
const TEXT_COLOR = "#ffffff";
// const BUTTON_ACTION_TEXT = "Done!";
const BUTTON_ACTION_WAIT_TIME = 1000;
const WAIT_TIME = 1000;
const BUTTON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#819067">
<path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" />
<path d="M17.0998 2H12.8998C9.81668 2 8.37074 3.09409 8.06951 5.73901C8.00649 6.29235 8.46476 6.75 9.02167 6.75H11.0998C15.2998 6.75 17.2498 8.7 17.2498 12.9V14.9781C17.2498 15.535 17.7074 15.9933 18.2608 15.9303C20.9057 15.629 21.9998 14.1831 21.9998 11.1V6.9C21.9998 3.4 20.5998 2 17.0998 2Z" "/>
</svg>
    `;
const BUTTON_ACTION_TEXT = `
<svg xmlns = "http://www.w3.org/2000/svg" xmlns: xlink = "http://www.w3.org/1999/xlink" viewBox = "0 -1.5 11 11" version = "1.1" fill="#819067">
    <title>done_mini [#1484]</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Dribbble-Light-Preview" transform="translate(-304.000000, -366.000000)" fill="#819067">
            <g id="icons" transform="translate(56.000000, 160.000000)">
                <polygon id="done_mini-[#1484]" points="259 207.6 252.2317 214 252.2306 213.999 252.2306 214 248 210 249.6918 208.4 252.2306 210.8 257.3082 206"></polygon>
            </g>
        </g>
    </g>
</svg>
`;


// Object containing button text and extra styles
const BUTTON_MAP = {
  copy: {
    text: "Copy",
    extra: "margin-right: 1rem; width: 80px;",
  },
  copyMarkdown: {
    text: "Copy",
    extra: "width: 32px;",
  },
};

// Object containing html tags and their corresponding markdown syntax
const MARKDOWN = {
  "<div>": "",
  "</div>": "",
  "<button.*?>": "",
  "</button>": "",
  "<p>": "",
  "</p>": "",
  "<u>": "",
  "</u>": "",
  "<ol>": "",
  "</ol>": "",
  "<ul>": "",
  "</ul>": "",
  "<li>": "- ",
  "</li>": "",
  "&nbsp;": "",
  "<em>": "",
  "</em>": "",
  "<strong>Input</strong>": "Input\n",
  "<strong>Output</strong>": "Output\n",
  "<strong>Explanation</strong>": "Explanation\n",
  "<strong>Input:</strong>": "Input:",
  "<strong>Output:</strong>": "Output:",
  "<strong>Explanation:</strong>": "Explanation:",
  "<strong>Input: </strong>": "Input: ",
  "<strong>Output: </strong>": "Output: ",
  "<strong>Explanation: </strong>": "Explanation: ",
  '<strong class="example">Example': "**Example",
  "<strong>": "**",
  "</strong>": "** ",
  "<pre>": "\n```\n",
  "</pre>": "```\n\n",
  "<code>": "\`",
  "</code>": "\`",
  "&lt;": "<",
  "&gt;": ">",
  "<sup>": "^",
  "</sup>": "",
  "	": "", // special tab
  "<span.*?>": "",
  "</span>": "",
  '<font face="monospace">': "",
  "</font>": "",
};

const copyText = (isMarkdown, targetObj) => {
  // Get the current URL.
  const url = window.location.href;

  // Try to find the elements for the old version of the website.
  let title;
  let level;
  let descriptionContent;
  let text;
  let html;

  // Get title
  title = targetObj.titleDom.innerText;
  title = title.replace(/^(\d+)(\.)/, (_, num, dot) => {
    return num.padStart(4, '0') + dot;
  });


  // Get level
  level = ""
  if (targetObj.level) {
    level = targetObj.level.innerText;
    level = "**" + level + "**" + "\n";
  }


  // Get main problem description
  descriptionContent = targetObj.descriptionDom;

  // Clean the content to be copied
  text = descriptionContent.textContent.replace(/(\n){2,}/g, "\n\n").trim();
  html = descriptionContent.innerHTML;

  // Removes unwanted elements.
  html = html
    .replace(/<div class=".*?" data-headlessui-state=".*?">/g, "")
    .replace(
      /<div id=".*?" aria-expanded=".*?" data-headlessui-state=".*?">/g,
      ""
    );

  // Create a hidden textarea element.
  const hiddenElement = document.createElement("textarea");

  let value;
  if (isMarkdown) {
    let htmlToMarkdown = html;
    // Replace HTML elements with markdown equivalents.
    Object.keys(MARKDOWN).forEach((key) => {
      htmlToMarkdown = htmlToMarkdown.replace(
        new RegExp(key, "g"),
        MARKDOWN[key]
      );
    });
    // Format the markdown string and add the title and URL.
    value = `# [${title}](${url})\n\n${level}\n${htmlToMarkdown
      .replace(/(\n){2,}/g, "\n\n")
      .trim()}`;
  } else {
    // Format the plain text string and add the title and URL.
    value = `URL: ${url}\n\n${title}\n\n${text}`;
  }

  // Set the value of the hidden textarea element.
  hiddenElement.value = value;
  // Add the element to the document.
  document.body.appendChild(hiddenElement);
  // Select the text in the element.
  hiddenElement.select();
  // Copy the text.
  document.execCommand("copy");
  // Remove the hidden element from the document.
  document.body.removeChild(hiddenElement);
};

// Set a timeout to give the page time to load before adding the buttons.
function execute() {
  // Target Layouts
  const TARGETS = [
    {
      name: "originalLayout",
      titleDom: document.querySelector("[data-cy=question-title]"),
      descriptionDom: document.querySelector(
        "[data-track-load=description_content]"
      ),
      useStyle: true,
      style: `
        position: absolute;
        top: 1rem;
        right: 0;
        display: flex;
      `,
      classList: [],
    },
    {
      name: "newLayout",
      titleDom: document.querySelector(
        ".mr-2.text-lg.font-medium.text-label-1.dark\\:text-dark-label-1"
      ),
      descriptionDom: document.querySelector(
        "[data-track-load=description_content]"
      ),
      useStyle: false,
      style: "",
      classList: [
        "mt-1",
        "inline-flex",
        "min-h-20px",
        "items-center",
        "space-x-2",
        "align-top",
      ],
    },
    {
      name: "contestLayout",
      titleDom: document.querySelector(
        "#base_content > div.container > div > div > div.question-title.clearfix > h3"
      ),
      descriptionDom: document.querySelector(
        "div.question-content.default-content"
      ),
      useStyle: true,
      style: `display: flex;`,
      classList: [],
    },
    {
      name: "dynamicLayout",
      titleDom: document.querySelector(".text-title-large"),
      level: document.querySelector(".text-title-large").parentElement.parentElement.nextElementSibling.firstChild,
      buttonTarget: document.querySelector(".text-title-large").parentElement.parentElement.nextElementSibling,
      descriptionDom: document.querySelector(
        "[data-track-load=description_content]"
      ),
      useStyle: true,
      style: `display: flex;`,
      classList: [],
    },
  ];

  // Determine which target layout.
  let target;

  // Create a container for the buttons.
  const buttonContainer = document.createElement("div");

  // Filter target DOM that is not null
  const filteredTarget = TARGETS.filter((t) => {
    const _target = t.titleDom;
    if (_target) {
      return _target;
    }
  });

  const targetObject = filteredTarget[0];
  target = targetObject.titleDom;

  // Style button by layout
  if (targetObject.useStyle) {
    buttonContainer.style = targetObject.style;
  } else {
    targetObject.classList.forEach((i) => buttonContainer.classList.add(i));
  }

  if (target) {
    // Set the parent element's position to relative to allow for absolute positioning of the button container.
    target.parentElement.style = "position: relative; align-items: center";

    // Set the base style for the buttons.
    const buttonStyle = `
      padding: 4px 4px;
      color: ${MAIN_COLOR};
      background: ${ALT_COLOR};
      border-radius: 12px;
      // border: 1px solid ${MAIN_COLOR};
      font-size: 10px;
      cursor: pointer;
      text-align: center;
      width: 32px;
    `;

    // Loop through the buttons and add them to the button container.
    // const buttons = ["copy", "copyMarkdown"];
    const buttons = ["copyMarkdown"];
    buttons.forEach((button) => {
      const _button = document.createElement("div");


      _button.innerHTML = BUTTON_SVG;
      // Styling.
      // _button.innerText = BUTTON_MAP[button].text;
      _button.style = BUTTON_MAP[button].extra
        ? buttonStyle + BUTTON_MAP[button].extra
        : buttonStyle;

      // Event listeners.
      _button.addEventListener("click", () => {
        copyText(button === "copyMarkdown", targetObject);
        _button.innerHTML = BUTTON_ACTION_TEXT;
        setTimeout(
          () => (
            // _button.innerText = BUTTON_MAP[button].text
            _button.innerHTML = BUTTON_SVG
          ),
          BUTTON_ACTION_WAIT_TIME
        );
      });

      _button.addEventListener("mouseenter", () => {
        _button.style.background = MAIN_COLOR;
        _button.style.color = TEXT_COLOR;
      });

      _button.addEventListener("mouseleave", () => {
        _button.style.background = ALT_COLOR;
        _button.style.color = MAIN_COLOR;
      });

      // Add the button to the button container.
      buttonContainer.append(_button);
    });

    // Add the button container to the parent element.
    if (targetObject.buttonTarget) {
      targetObject.buttonTarget.appendChild(buttonContainer)
    }
    else {
      target.parentElement.appendChild(buttonContainer);
    }
  }
}


function waitForElement(selector, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const el = document.querySelector(selector);
            if (el) {
                resolve(el);
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Optional: timeout after a certain period
        setTimeout(() => {
            reject(new Error('Element not found within timeout.'));
            observer.disconnect();
        }, timeout);
    });
}





waitForElement('.text-title-large')
    .then((el) => {
        console.log('Title appeared:', el);
        execute();
    })
    .catch((err) => {
        console.error(err);
    });