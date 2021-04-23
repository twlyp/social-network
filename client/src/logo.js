export default function Logo() {
    const logoStyle = {
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        margin: "5px",
        background: `radial-gradient(
                var(--white),
                #ffffffcc 30%,
                #ffffff33 60%, 
                var(--violet)
                )`,
        cursor: "pointer",
        position: "relative",
    };

    const kStyle = {
        color: "var(--violet)",
        fontWeight: "bold",
        fontSize: "25px",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        fontFamily: "Montserrat, sans-serif",
    };

    return (
        <div style={logoStyle} onClick={() => location.replace("/")}>
            <span style={kStyle}>K</span>
        </div>
    );
}
