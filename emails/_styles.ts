const mauve = {
  mauve1: '#fdfcfd',
  mauve2: '#faf9fb',
  mauve3: '#f2eff3',
  mauve4: '#eae7ec',
  mauve5: '#e3dfe6',
  mauve6: '#dbd8e0',
  mauve7: '#d0cdd7',
  mauve8: '#bcbac7',
  mauve9: '#8e8c99',
  mauve10: '#84828e',
  mauve11: '#65636d',
  mauve12: '#211f26',
};

const violet = {
  violet1: '#fdfcfe',
  violet2: '#faf8ff',
  violet3: '#f4f0fe',
  violet4: '#ebe4ff',
  violet5: '#e1d9ff',
  violet6: '#d4cafe',
  violet7: '#c2b5f5',
  violet8: '#aa99ec',
  violet9: '#6e56cf',
  violet10: '#654dc4',
  violet11: '#6550b9',
  violet12: '#2f265f',
};

const ruby = {
  ruby1: '#fffcfd',
  ruby2: '#fff7f8',
  ruby3: '#feeaed',
  ruby4: '#ffdce1',
  ruby5: '#ffced6',
  ruby6: '#f8bfc8',
  ruby7: '#efacb8',
  ruby8: '#e592a3',
  ruby9: '#e54666',
  ruby10: '#dc3b5d',
  ruby11: '#ca244d',
  ruby12: '#64172b',
};

export const main = {
  backgroundColor: mauve.mauve1,
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
};

export const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  marginBottom: '16px',
  padding: '24px 16px',
  border: '1px solid #eee',
  borderRadius: '5px',
  boxShadow: `0 5px 10px ${mauve.mauve6}`,
};

export const heading = {
  color: violet.violet12,
  fontSize: '24px',
  fontWeight: 'medium',
  lineHeight: '32px',
  margin: '16px 0 0',
  textAlign: 'center' as const,
};

export const primary = {
  color: mauve.mauve12,
  fontSize: '16px',
  lineHeight: '28px',
  textAlign: 'center' as const,
};

export const secondary = {
  color: mauve.mauve11,
  fontSize: '16px',
  lineHeight: '28px',
  textAlign: 'center' as const,
};

export const tertiary = {
  fontSize: '16px',
  color: mauve.mauve10,
  display: 'block',
  textAlign: 'center' as const,
};

export const warning = {
  color: ruby.ruby9,
  fontSize: '24px',
  lineHeight: '32px',
  textAlign: 'center' as const,
};

export const logo = {
  margin: '12px auto 0',
};

export const codeContainer = {
  background: mauve.mauve3,
  borderRadius: '4px',
  margin: '16px auto 14px',
  verticalAlign: 'middle',
  width: '280px',
};

export const codeNumbers = {
  color: '#000',
  fontFamily: 'HelveticaNeue-Bold',
  fontSize: '32px',
  fontWeight: 700,
  letterSpacing: '6px',
  lineHeight: '40px',
  paddingBottom: '8px',
  paddingTop: '8px',
  margin: '0 auto',
  display: 'block',
  textAlign: 'center' as const,
};

export const buttonContainer = {
  margin: '16px auto 14px',
  verticalAlign: 'middle',
  width: '280px',
};

export const button = {
  marginTop: '16px',
  backgroundColor: violet.violet9,
  borderRadius: '5px',
  color: '#fff',
  display: 'block',
  fontSize: '16px',
  fontWeight: 'semi-bold',
  textAlign: 'center' as const,
  textDecoration: 'none',
  padding: '12px 64px',
  margin: '0 auto',
};

export const hr = {
  borderColor: mauve.mauve6,
  margin: '20px 0',
};

export const linkContainer = {
  background: mauve.mauve3,
  borderRadius: '4px',
  margin: '16px auto 14px',
  verticalAlign: 'middle',
};

export const linkText = {
  color: mauve.mauve11,
  fontSize: '16px',
  lineHeight: '28px',
  textAlign: 'center' as const,
  padding: '0 16px',
};
