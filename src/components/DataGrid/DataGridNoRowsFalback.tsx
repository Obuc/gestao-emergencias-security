import React from 'react';

const DataGridNoRowsFalback = () => {
  return <div style={{ textAlign: 'center', gridColumn: '1/-1' }}>Nenhum registro encontrado!</div>;
};

export default React.memo(DataGridNoRowsFalback);
