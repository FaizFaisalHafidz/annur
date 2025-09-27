export default function AppLogo() {
    return (
        <>
            <img 
                src="https://neoflash.sgp1.cdn.digitaloceanspaces.com/logo-ma.png" 
                alt="Logo Mathla'ul Anwar" 
                className="size-12 object-contain"
            />
            <div className="ml-3 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold text-green-900">SMA Mathla'ul Anwar</span>
                {/* <span className="truncate text-xs text-green-700/80">SIDS</span> */}
            </div>
        </>
    );
}
