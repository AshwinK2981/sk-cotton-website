const fs=require('fs');
const s=fs.readFileSync('client/src/App.jsx','utf8');
let stack=[];
for (let i=0;i<s.length;i++){
  const c=s[i];
  if(c==='\'{' ) stack.push(i);
  else if(c==='}') { if(stack.length===0){ console.error('Unmatched } at',i); process.exit(2);} stack.pop(); }
}
if(stack.length>0){ console.error('Unmatched { count',stack.length,'at pos',stack[stack.length-1]); process.exit(3); }
console.log('Braces OK');
