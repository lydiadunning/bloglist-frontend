#Kinds of Tests and Reasons to Use Them#

`render()`
*render* is imported from @testing-library/react
renders for testing- a prerequisite step

`screen.getByText()`
*screen* is imported from @testing-library/react
Verify that text renders to the screen
Seems to also get text styled `display:none`
Causes an exception if the text is not present

`const {container} = render()`
defines a container with the rendered screen

`container.querySelector()`
finds an element in that container.

query result`.toHaveTextContent` verifies text appears in a specific location

`screen.getByText(-string-,{exact: false})`
to test for text { inAVariable }

`await screen.findByText()`
also finds text in variables, but it returns a promise

`await screen.queryByText()`
doesn't throw an exception, can identify a null value with:
`expect(-queryByTextResult-).toBeNull()`
