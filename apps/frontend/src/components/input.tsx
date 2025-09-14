interface inputProps {
    size : string,
    type : string,
    colour :string,
    placeHolder : string
    inputRef?: React.RefObject<HTMLInputElement>;
    

}

const defaultProps = "rounded-2xl outline-none p-4"
export function InputBox({size,type,colour,placeHolder,inputRef}:inputProps){
    return(
        <>
        <input type={`${type}`} className={`${size} ${colour} ${defaultProps}`} placeholder={`${placeHolder}`} ref={inputRef} />
        </>
    )

}