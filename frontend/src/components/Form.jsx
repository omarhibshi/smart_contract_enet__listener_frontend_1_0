import React from "react"
import { useState } from "react"

function Form() {
    const Form = () => {}
    const [formData, setFormData] = useState({
        title: "",
        body: "",
    })
    const onChangeInput = (e) =>
        setFormData({ ...formData, title: e.target.value })

    const OnChangeTextArea = (e) =>
        setFormData({ ...formData, body: e.target.value })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h4> Our Form </h4>
                <label htmlFor="title">Title</label>
                <br />
                <input
                    onChange={onChangeInput}
                    value={formData.title}
                    type="text"
                    name="title"
                    id="title"
                />
                <br />
                <label htmlFor="body">Body</label>
                <br />
                <textarea
                    onChange={OnChangeTextArea}
                    value={formData.body}
                    name="body"
                    id="body"
                ></textarea>
                <br />
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}
export default Form
