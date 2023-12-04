const issuer = props.issuer ?? "community.i-am-human.near";
const title = props.title ?? "NDC SBTs";
const showProgress = props.showProgress ?? false;
const showDropdown = props.showDropdown ?? false;
const showHeader = props.showHeader ?? false;
const showHolders = props.showHolders ?? true;

State.init({
  read_index: 0,
  tokens: [],
  issuer: issuer,
  sbtList: [],
  title: title,
});
// TO-DO
// add conditional dropdown, add search, add icons on dropdown // add total holders
// future add classes

// add custom

// Load badge helper functions
function loadSBTs() {
  const res = fetch(
    "https://raw.githubusercontent.com/codingshot/ndc-landing/main/data/sbtList.json"
  );
  return res.body && JSON.parse(res.body);
}
const sbtList = loadSBTs();
State.update({ sbtList: sbtList });
if (!state.sbtList) {
  return "⧗ Loading  SBT List...";
}

// if (state.read_index != -1) {
//   const tokens = Near.view("registry.i-am-human.near", "sbt_tokens", {
//     issuer: state.issuer,
//     from_token: 1 + state.read_index * 100,
//     limit: 100,
//   });

//   if (tokens) {
//     if (!tokens.length) {
//       State.update({ read_index: -1 });
//     } else {
//       State.update({
//         read_index: state.read_index + 1,
//         tokens: [...state.tokens, ...tokens],
//       });
//     }
//   }
// }
// Load hodlers helper functions
function renderHolders() {}
function loadHolders() {
  if (state.read_index != -1) {
    const tokens = Near.view("registry.i-am-human.near", "sbt_tokens", {
      issuer: state.issuer,
      from_token: 1 + state.read_index * 100,
      limit: 100,
    });

    if (tokens) {
      if (!tokens.length) {
        State.update({ read_index: -1 });
      } else {
        State.update({
          read_index: state.read_index + 1,
          tokens: [...state.tokens, ...tokens],
        });
      }
    }
  }
  renderHolders();
}
loadHolders();
const handleIssuerChange = (e) => {
  State.update({ issuer: e.target.value });
  console.log("Issuer Address: " + state.issuer);
  loadHolders();
};

const handleSbtChange = (e) => {
  State.update({
    issuer: sbtList
      .filter((sbt) => sbt.title === e.target.value)
      .map((el) => el.address)[0],
  });
  console.log("New Issuer based on SBT change " + state.issuer);
  loadHolders();
}; // need to change this around

console.log(tokens.length); // put in progress meter

const Members = () => (
  <>
    {state.tokens.map((token) => (
      <li class="mb-2">
        <Widget
          src="chaotictempest.near/widget/AccountProfileCard"
          props={{ accountId: token.owner }}
        />
      </li>
    ))}
  </>
);

return (
  <div>
    {showHeader && (
      <Widget
        src="ndcplug.near/widget/NDC.Common.SimpleHeader"
        props={{ title: state.title }}
      />
    )}

    {showProgress && (
      <Widget
        src="ndcplug.near/widget/NDC.Common.ProgressMeter"
        props={{
          total: "300",
          users: state.tokens.length,
          description: "OG Holders",
          width: "150",
          title: "NDC OG Holders",
        }}
      />
    )}
    {showHolders && <h3>Total Holders: {state.tokens.length}</h3>}
    {showDropdown && (
      <div>
        <label>Choose A NDC Community SBT 🛡️ Badge</label>

        <div className="sbt">
          <select
            className="form-select"
            aria-label="select asset"
            onChange={handleSbtChange}
          >
            <option selected disabled>
              {" "}
              Select a badge
            </option>
            {sbtList &&
              sbtList.map((sbt) => (
                <option value={sbt.title} selected={sbt.selected}>
                  {sbt.title}
                </option>
              ))}
            // add receiver logic here
          </select>
        </div>
        <div className="balance input-group">
          <input
            style={{ maxWidth: "100%" }}
            type="string"
            defaultValue={state.issuer} // feel like this wrong
            value={state.issuer}
            placeholder={state.issuer}
            onChange={handleIssuerChange}
          />
        </div>
      </div>
    )}
    <ol>
      <Members />
    </ol>
  </div>
);
