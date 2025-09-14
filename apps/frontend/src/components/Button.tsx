import { ReactNode } from 'react';

interface ButtonProps {
  size: string;
  colour: string;
  text: string | ReactNode;
  onClick?: () => void;
}

const defaultProps = "mt-6 rounded-md hover:bg-teal-300";

export function Button({ size, colour, text, onClick }: ButtonProps) {
    return(
        <>
        <button className={`${size} ${colour} ${defaultProps}`} onClick={onClick}>{text}</button>
        </>
    )
}