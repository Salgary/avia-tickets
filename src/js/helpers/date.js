import { format } from "date-fns";

export function formatDate(str,type) {
    const date = new Date(str);
    return format(date,type); 
}