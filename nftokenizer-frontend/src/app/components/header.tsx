import Image from 'next/image'

export default function Header() {
  const descriptionText: React.CSSProperties = {
    fontWeight: '700',
    fontSize: '17px',
    lineHeight: '29px',
    textAlign: 'center',
    width: '800px',
    marginTop: '23px'
  }

  return (
    <div className='flex flex-col items-center' style={{ paddingTop: '105px', paddingBottom: '50px' }}>
      <Image
        src="images/nftokenizer-logo.svg"
        alt="nftokenizer"
        width={498}
        height={46}
        priority
      />
      <p style={descriptionText}>Make your NFT using<br />
        Plastic Credits, Eco Credits or Smart Contracts</p>
    </div>
  )
}