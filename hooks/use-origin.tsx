import { useEffect, useState } from "react";

export const useOrigin = () => {

  const [moutend, setMoutend] = useState(false);

  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

  useEffect(()=>{
    setMoutend(true);
  },[])

  if(!moutend) return ''

  return origin;
}