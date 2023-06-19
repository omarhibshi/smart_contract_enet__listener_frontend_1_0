function Button({ color = "primary", onClick, children, disabled }) {
    return (
        <button
            className={"btn btn-" + color}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Button
