const session = 'eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWNmMzcyMGZkYzE1MTA2ODVmYzFmNDQwIn19';

const buffer = Buffer.from(session, 'base64');
const decode = buffer.toString('utf8')

const newBuffer = Buffer.from(decode, 'utf8');
console.log(newBuffer.toString('base64') === session);
