// GUEST


// BUTTONS

const buttonStyles = {
    fontWeight: 700,
    textTransform: "none",
    p: "0.8em",
    borderRadius: "0.4em",
    fontSize: "1.2rem",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
};

const blueButton = {
    ...buttonStyles,
    backgroundColor: "#407BFF",
    color: "white",
    "&:hover": { backgroundColor: "white", color: "#407BFF" }
};
  
const whiteButton = {
    ...buttonStyles,
    backgroundColor: "white",
    color: "#407BFF",
    "&:hover": { backgroundColor: "#407BFF", color: "white" }
};

const guestBlueButton = {
    ...blueButton,
    width: "45%"
}

const guestWhiteButton = {
    ...whiteButton,
    width: "45%"
}

const guestViewDetailsButton = {
    ...buttonStyles,
    px: "0.8em",
    py: "0.4em",
    fontSize: "1rem",
    borderRadius: "0.2em",
    backgroundColor: "#407BFF",
    color: "white",
    fontWeight: 500,
    "&:hover": { backgroundColor: "#0053FA" }
}

export { buttonStyles, blueButton, whiteButton, guestBlueButton, guestWhiteButton, guestViewDetailsButton };


// CONTAINERS

const guestDefaultContainer = {
    disableGutters: true,
    maxWidth: "xl",
    sx: { }
}

const guestContainerMain = {
    ...guestDefaultContainer,
    sx: { px: "6.5em" }
}

const guestContainerBesidesHome = {
    ...guestContainerMain,
    sx: { pt: "6em", px: "6.5em" }
}

export { guestDefaultContainer, guestContainerMain, guestContainerBesidesHome }


// TEXT

const guestTitle = {
    textAlign: "center",
    fontWeight: "700",
    color: "#407BFF",
    fontSize: "4rem",
    mb: "0.5em"
}

const guestSpanStrong = {
    color: "#407BFF",
    fontWeight: 700
}

export { guestTitle, guestSpanStrong }