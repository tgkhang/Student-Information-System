// GUEST UI


// BUTTONS

const buttonStyles = {
    fontWeight: 700,
    textTransform: "none",
    p: "0.8em",
    borderRadius: "0.4em",
    fontSize: "1.2rem",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
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
    "&:hover": { backgroundColor: "#2970FF" }
}

const guestRoundBlueButton = {
    ...blueButton,
    fontSize: "0.8rem",
    borderRadius: "2em",
    fontWeight: 700
}

export { buttonStyles, blueButton, whiteButton, guestBlueButton, guestWhiteButton, guestViewDetailsButton, guestRoundBlueButton };


// CONTAINERS

const guestDefaultContainer = {
    disableGutters: true,
    maxWidth: "xl"
}

const guestContainerHomeParts = {
    ...guestDefaultContainer,
    sx: { px: "6.5em" }
}

const guestContainerBesidesHome = {
    ...guestDefaultContainer,
    sx: { py: "7em", pb: "3em", px: "6.5em" }
}

const guestContainerLogin = {
    ...guestDefaultContainer,
    sx: { width: "100vw", height: "100vh",
        position: "relative", overflow: "hidden",
        display: "flex", justifyContent: "center", alignItems: "center" }
}

const guestContainerLoginBox = {
    width: "75%",
    height: "75%",
    padding: "3em",
    borderRadius: "1rem",
    backgroundColor: "white",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "3em"
}

const guestContainerLoginSection = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2em"
}

const guestContainerLoginSubsection = {
    display: "flex",
    flexDirection: "column",
    gap: "0.7em",
    width: "80%"
}

const guestContainerImage = {
    disableGutters: true,
    maxWidth: "xl",
    py: "7em", pb: "3em", px: "6.5em",
    minHeight: "100vh",
    position: "relative",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",

    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: -1
    },

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
    zIndex: 0,
}

const guestContainerContact = {
    ...guestContainerImage,
    backgroundImage: "url('/Contact.jpg')",
}

const guestContainerImageHome = {
    ...guestContainerImage,
    backgroundImage: "url('/SaigonBridge.jpg')",
    gap: "7em", pt: "5em"
}

export { guestDefaultContainer, guestContainerHomeParts, guestContainerBesidesHome,
        guestContainerImage, guestContainerContact, guestContainerImageHome,
        guestContainerLogin, guestContainerLoginBox, guestContainerLoginSection, guestContainerLoginSubsection, }


// TEXT

const guestTitle = {
    textAlign: "center",
    fontWeight: "700",
    color: "#407BFF",
    fontSize: "3.5rem",
    mb: "1em"
}

const guestSpanStrong = {
    color: "#407BFF",
    fontWeight: 700
}

const guestLoginSection = {
    fontSize: "0.8rem",
    textAlign: "center",
    color: "text.secondary",
}

const guestLoginLabel = {
    fontSize: "0.8rem",
    color: "black"
}

export { guestTitle, guestSpanStrong, guestLoginSection, guestLoginLabel }

// CARD

const guestBlueStairsCard = {
    backgroundColor: "#0543F1",
    p: "1.5em",
    borderRadius: 3,
    display: "flex",
    gap: "2em",
    width: "50%",
}

export { guestBlueStairsCard }