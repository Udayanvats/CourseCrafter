

export default function Avatar({ src, size = 50,
    name

}: { src?: string; size: number, name: string }) {

    let s = size.toString()
    console.log(`w-[${s}px]`)
    const hRange: [number, number] = [0, 360];
    const sRange: [number, number] = [50, 60];
    const lRange: [number, number] = [45, 55];
    const getHashOfString = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        hash = Math.abs(hash);
        return hash;
    };
    const normalizeHash = (hash: number, min: number, max: number) => {
        return Math.floor((hash % (max - min)) + min);
    };
    const generateHSL = (name: string) => {
        const hash = getHashOfString(name);
        const h = normalizeHash(hash, hRange[0], hRange[1]);
        const s = normalizeHash(hash, sRange[0], sRange[1]);
        const l = normalizeHash(hash, lRange[0], lRange[1]);
        return `hsl(${h},${s}%,${l}%)`;
    };


    const getFirstLetter = (name: string) => {
        console.log(name)
        return name.charAt(0).toUpperCase();
    }
    console.log(generateHSL(name))
    return (
        <div style={
            {
                width: `${size}px`,
                height: `${size}px`,
                minHeight: `${size}px`,
                minWidth: `${size}px`,

            }

        } className={` rounded-full  justify-center items-center `}>
            {src ?
                <div className="w-full h-full rounded-full overflow-hidden object-cover justify-center items-center flex bg-background3  ">
                    <img className="w-full h-full" src={src} />
                </div>
                :
                <div className={` w-full h-full flex rounded-full justify-center items-center self-center text-white font-bold `} style={{
                    backgroundColor: generateHSL(name),
                    fontSize: `${size / 1.8}px`

                }}>
                    {getFirstLetter(name)}
                </div>
            }
        </div>
    )
}
