export default function NFTCard({ image, name, description, price, action }) {
  return (
    <div className="border shadow rounded-xl overflow-hidden">
      <img src={image} data-testid="nft-image" />
      <div className="p-4">
        <p style={{ height: "64px" }} className="text-2xl font-semibold">
          {name}
        </p>
        {description ? (
          <div style={{ height: "70px", overflow: "hidden" }}>
            <p className="text-gray-400">{description}</p>
          </div>
        ) : null}
      </div>
      <div className="p-4 bg-black">
        <p className="text-2xl font-bold text-white">{price} ETH</p>
        {action}
      </div>
    </div>
  );
}
