export const FormErrors = ({errors}) => {
  let content
  console.log(errors);
  try {
    content = (
      <ul>
        {
          Object.keys(errors).map((k, i) => (
            <li key={i}>
              {k?.toUpperCase().replaceAll("_", " ")}
              <ol>
                {
                  typeof errors[k] === "string"
                  ? <li>{errors[k].slice(0, 128)}</li>
                  : errors[k].map((e, ei) => (
                    <li key={ei}>{e}</li>
                  ))
                }
              </ol>
            </li>
          ))
        }
      </ul>
    )
  } catch (error) {
    // console.log(error);
    content = <p>Failed to parse Error</p>
  }

  return (
    <div className="alert alert-danger">
    {content}
    </div>
  )
}
