<table className="table">
  <thead>
    <tr>
      <th className="text-center">Nom</th>
      <th className="text-center">Pays</th>
      <th className="text-center">Secteur</th>
      <th className="text-center">Industrie</th>
      <th width={200} className="text-center">Capitalisation (Mds)</th>
      <th width={200} className="text-center">PEA</th>
      <th width={200} className="text-center">Dividende</th>
    </tr>
  </thead>
  <tbody>
    {infos.map((company) => (
      <tr key={company.symbol} onClick={() => window.open(`/details/${company.symbol}`, '_blank')}>
        <td className="d-flex align-items-center justify-content-center">
          <img
            src={company.logo}
            alt={`${company.Name} logo`}
            width="50"
            height="50"
            style={{ marginRight: '10px' }}
          />
          <div>
            <div>{company.Name}</div>
            <div>{company.symbol}</div>
          </div>
        </td>
        <td className="text-center">{company.pays}</td>
        <td className="text-center">{company.secteur}</td>
        <td className="text-center">{company.industrie}</td>
        <td className="text-center">{formatNumber(company.marketcap)}</td>
        <td className="text-center">{company.eligiblePea ? 'Oui' : 'Non'}</td>
        <td className="text-center">
          {company.VerseDividende ? (
            <FontAwesomeIcon icon={faCheck} color="green" />
          ) : (
            <FontAwesomeIcon icon={faTimes} color="red" />
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
