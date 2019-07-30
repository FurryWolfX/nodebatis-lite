const lastWhereReg = /\s+where\s*$/i;
const whereAndReg = /\s+where\s+and\s+/gi;
const whereOtherReg = /\s+where\s+(union\s+|order\s+|group\s+|limit\s+)/gi;
const searchReg = /\s+where\s+/i;

module.exports = function(result) {
  result = result.replace(lastWhereReg, "");
  result = result.replace(whereAndReg, " where ");
  result = result.replace(whereOtherReg, match => {
    return match.replace(searchReg, " ");
  });
  return result;
};
