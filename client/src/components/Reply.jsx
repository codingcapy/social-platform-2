



export default function Reply(props) {

    return(
        <div className="ml-4 pl-2 my-3 border border-cyan-400 border-t-0 border-l-2 border-r-0 border-b-0">
            <p><strong>{props.username}</strong> {props.date}</p>
            <p>{props.content}</p>
        </div>
    )
}