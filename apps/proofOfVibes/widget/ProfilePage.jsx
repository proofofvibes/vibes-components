/** to-do
 * Add vibes map, fix hashtag
 * Add pov link to doc
 */
State.init({
  selectedTab: props.tab || "feed",
});
const accountId = props.accountId ?? "proofofvibes.near";
const socialProfile = Social.getr(`${accountId}/profile`);
const role = props.role ?? "vibee";
// const accountId = props.accountId ?? context.accountId;
const daoId = props.daoId ?? "vibes.sputnik-dao.near";
const issuer = props.issuer ?? "issuer.proofofvibes.near";
const reference =
  props.reference ??
  "https://genadrop.mypinata.cloud/ipfs/QmQ1662QyTESnzWK8gBJdD7BtwQ3ddfXCMy6Hh3FHdmjMk?_gl=1*1wqwed9*_ga*MTQ0ODg3NzEzNS4xNjgyNjA0ODQy*_ga_5RMPXG14TE*MTY5MDA1MDEyNC4xMS4xLjE2OTAwNTAxMjcuNTcuMC4w"; // vibes sbt mint
const sbtTitle = props.sbtTitle ?? "";
State.init({
  accountId: accountId,
  socialProfile: socialProfile,
  daoId: daoId,
  issuer: issuer,
  role: role,
  sbtTitle: sbtTitle,
});
const changeReceiver = (receiver) => {
  State.update({
    receiver,
  });
  console.log("Receiver: " + state.receiver);
};
const page = accountId
  ? Social.get(`${accountId}/settings/dao/page`)
  : undefined;

if (page === null) {
  return "Loading...";
}

// const isTastemaker = (
//   <Widget src="proofofvibes.near/widget/Vibes.isTastemaker" />
// );
// console.log(isTastemaker);

const roleCheckThisUser = props.roleCheckThisUser ?? context.accountId; // maybe make conditional if not in dao

const isTastemaker = false;
const roleToCheck = props.roleToCheck ?? "tastemaker";

const proposalKinds = {
  ChangeConfig: "config",
  ChangePolicy: "policy",
  AddMemberToRole: "add_member_to_role",
  RemoveMemberFromRole: "remove_member_from_role",
  FunctionCall: "call",
  UpgradeSelf: "upgrade_self",
  UpgradeRemote: "upgrade_remote",
  Transfer: "transfer",
  SetStakingContract: "set_vote_token",
  AddBounty: "add_bounty",
  BountyDone: "bounty_done",
  Vote: "vote",
  FactoryInfoUpdate: "factory_info_update",
  ChangePolicyAddOrUpdateRole: "policy_add_or_update_role",
  ChangePolicyRemoveRole: "policy_remove_role",
  ChangePolicyUpdateDefaultVotePolicy: "policy_update_default_vote_policy",
  ChangePolicyUpdateParameters: "policy_update_parameters",
};

const actions = {
  AddProposal: "AddProposal",
  VoteApprove: "VoteApprove",
  VoteReject: "VoteReject",
  VoteRemove: "VoteRemove",
};

// -- Get all the roles from the DAO policy
let roles = Near.view(daoId, "get_policy");
roles = roles === null ? [] : roles.roles;

const getUserRoles = (user) => {
  const userRoles = [];
  for (const role of roles) {
    if (role.kind === "Everyone") {
      continue;
    }
    if (!role.kind.Group) continue;
    if (user && role.kind.Group && role.kind.Group.includes(user)) {
      userRoles.push(role.name);
    }
  }
  return userRoles;
};

const isUserAllowedTo = (user, kind, action) => {
  // -- Filter the user roles
  const userRoles = [];
  for (const role of roles) {
    if (role.kind === "Everyone") {
      userRoles.push(role);
      continue;
    }
    if (!role.kind.Group) continue;
    if (user && role.kind.Group && role.kind.Group.includes(user)) {
      userRoles.push(role);
    }
  }

  // -- Check if the user is allowed to perform the action
  let allowed = false;

  userRoles
    .filter(({ permissions }) => {
      const allowedRole =
        permissions.includes(`${kind.toString()}:${action.toString()}`) ||
        permissions.includes(`${kind.toString()}:*`) ||
        permissions.includes(`*:${action.toString()}`) ||
        permissions.includes("*:*");
      allowed = allowed || allowedRole;
      return allowedRole;
    })
    .map((role) => role.name);

  return allowed;
};
const userRoles = roleCheckThisUser ? getUserRoles(roleCheckThisUser) : [];
isTastemaker = userRoles.includes(roleToCheck);
const isVibee = userRoles.includes("vibee");

const feed = state.accountId
  ? Social.get(`${state.accountId}/settings/dao/feed`)
  : undefined;

if (feed === null) {
  return "Loading...";
}

if (props.tab && props.tab !== state.selectedTab) {
  State.update({
    selectedTab: props.tab,
  });
}

const widgetOwner = "proofofvibes.near";
const profile = props.profile ?? Social.getr(`${state.daoId}/profile`);
const accountUrl = `#/${widgetOwner}/widget/Vibes.DAO.main?daoId=${daoId}&issuer=${issuer}&accountId=${accountId}&role=${role}&sbtTitle=${sbtTitle}`;

const DEFAULT_BACKGROUND_COLOR = state.darkmode ? "#191919" : "#fff";
const DEFAULT_COMPONENT_COLOR = state.darkmode ? "rgba(0,0,0,.8)" : "#fff";
const DEFAULT_GRADIENT =
  "linear-gradient(90deg, rgb(147, 51, 234) 0%, rgb(79, 70, 229) 100%)";

const DEFAULT_TEXT_COLOR = state.darkmode ? "#fff" : "#000";
const Wrapper = styled.div`
  padding-bottom: 48px;
`;

const Main = styled.div`
  display: grid;
  gap: 40px;
  grid-template-columns: 352px minmax(0, 1fr);
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const BackgroundImage = styled.div`
  height: 240px;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  margin: 0 -12px;
  background: #eceef0;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 1200px) {
    margin: calc(var(--body-top-padding) * -1) -12px 0;
    border-radius: 0;
  }

  @media (max-width: 900px) {
    height: 100px;
  }
`;

const SidebarWrapper = styled.div`
  position: relative;
  z-index: 5;
  margin-top: -55px;

  @media (max-width: 900px) {
    margin-top: -40px;
  }
`;

const Content = styled.div`
  .post {
    padding-left: 0;
    padding-right: 0;
  }
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: ${(p) => p.size || "25px"};
  line-height: 1.2em;
  color: #11181c;
  margin: ${(p) => (p.margin ? "0 0 24px" : "0")};
  overflow-wrap: anywhere;
`;

const Tabs = styled.div`
  display: flex;
  height: 48px;
  border-bottom: 1px solid #eceef0;
  margin-bottom: 28px;
  overflow: auto;
  scroll-behavior: smooth;

  @media (max-width: 1200px) {
    background: #f8f9fa;
    border-top: 1px solid #eceef0;
    margin: 0 -12px 26px;

    > * {
      flex: 1;
    }
  }
`;

const TabsButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 600;
  font-size: 12px;
  padding: 0 12px;
  position: relative;
  color: ${(p) => (p.selected ? "#11181C" : "#687076")};
  background: none;
  border: none;
  outline: none;
  text-align: center;
  text-decoration: none !important;

  &:hover {
    color: #11181c;
  }

  &::after {
    content: "";
    display: ${(p) => (p.selected ? "block" : "none")};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #59e692;
  }
`;

const Bio = styled.div`
  color: #11181c;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 48px;

  > *:last-child {
    margin-bottom: 0 !important;
  }

  @media (max-width: 900px) {
    margin-bottom: 48px;
  }
`;
const ScoreBoard = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 0.8rem;
  background-color: ${DEFAULT_COMPONENT_COLOR};
  border: 2px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  color: ${DEFAULT_TEXT_COLOR};
  text-decoration: none !important;

  &:hover {
    transition: all 0.2s;
    border: 2px solid rgb(79, 70, 229);
    background: linear-gradient(
      90deg,
      rgba(147, 51, 234, 0.08) 0%,
      rgba(79, 70, 229, 0.08) 100%
    );
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 30px;
  }

  & > div {
    h1 {
      font-size: 0.9rem;
      font-weight: bold;
      letter-spacing: -0.5px;
    }

    p {
      font-size: 0.8rem;
      margin: 0;
      padding: 0;
    }
  }
`;
const VIBES_LOGO_URL =
  "https://ipfs.near.social/ipfs/bafkreibyhg5a2vcjxtg4fospq6qe5cadi2653jb7lvbyoez4p65btfeppa";
const Logo = styled.img`
  max-width: 30px;
`;

const Info = styled.div`
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 30px;
  border-radius: 10px;
  border: 1px solid rgb(79, 70, 229);
  background: ${DEFAULT_GRADIENT};
  color: #fff;
  box-sizing: border-box;
  padding: 0.8rem;
  margin-bottom: 0.8rem;
  box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.1);
  & a:hover {
    transition: all 0.2s;
    border: 2px solid rgb(79, 70, 229);
    background: black;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 30px;
  }

  h1 {
    font-size: 0.9rem;
    font-weight: bold;
    letter-spacing: -0.5px;
  }

  p {
    font-size: 0.8rem;
  }

  a {
    font-size: 0.8rem;
    border: 0;
    letter-spacing: -0.5px;
    padding: 0.5rem 1rem;
    text-decoration: none;
  }

  a.primary {
    background-color: #fff !important;
    color: rgb(147, 51, 234) !important;
    border: 2px solid #fff;
  }

  a.secondary {
    color: #fff;
    border: 2px solid #fff;
  }
`;

if (profile === null) {
  return "Loading...";
}

return (
  <Wrapper>
    {false && <Widget src="proofofvibes.near/widget/Vibes.Countdown" />}

    <BackgroundImage>
      <Widget
        src="mob.near/widget/Image"
        props={{
          image: profile.BackgroundImage,
          alt: "profile background image",
          fallbackUrl:
            "https://ipfs.near.social/ipfs/bafybeia4ulzl63j7uuy5hbwdj352qmxsjyy2iypyzv7hvxawl64psh5454",
        }}
      />
    </BackgroundImage>

    <Main>
      <SidebarWrapper>
        <Widget
          src="ndcplug.near/widget/DAO.main.sidebar"
          props={{
            daoId: daoId,
            profile,
            role: role,
            showLinks: false,
            showSearchDAOs: false,
          }}
        />
        <Info>
          <h1>Join the 🌍 Global Vibes Community</h1>
          <p>
            "Tap-in" in to an exclusive event by a tastemaker to be part of the
            rewards program for good vibes, or do a permisionless vibe-check on
            our feed to get Veri-vibed locally.
          </p>
          <a
            className="btn primary"
            target="_blank"
            href="https://ProofOfVibes.com/telegram"
          >
            Join the community
          </a>
          <a
            className="btn secondary"
            target="_blank"
            href="https://ProofOfVibes.com"
          >
            Learn more
          </a>
        </Info>
        <ScoreBoard href="https://ProofOfVibes.com/feedback" target="_blank">
          <div>
            <h1>
              <Logo
                src={VIBES_LOGO_URL}
                style={{
                  maxWidth: "30px",
                }}
              />{" "}
              Feedback = Good Vibes
            </h1>
            <div></div>
            <p>
              Want to improve the Vibes Protocol? Click this tile to post
              constructive vibes on our public feedback board
            </p>
          </div>
        </ScoreBoard>
        <ScoreBoard href="https://twitter.com/VibesProof" target="_blank">
          <div>
            <h1>
              <Logo
                src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg"
                style={{
                  maxWidth: "30px",
                }}
              />{" "}
              We Tweet Vibes Too
            </h1>
            <div></div>
            <p>
              Lol web2 vibes, but we automate on chain so its chill. Get the
              best of both vibes.
            </p>
          </div>
        </ScoreBoard>
        <ScoreBoard
          href="https://ProofofVibes.com/apple-worldwide-playlist"
          target="_blank"
        >
          <div>
            <h1>
              <Logo
                src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Apple_Music_icon.svg"
                style={{
                  maxWidth: "30px",
                }}
              />{" "}
              Listen to the Vibes
            </h1>
            <div></div>
            <p>
              Our community also curates vibes you can listen too of course.
              Remember to hop on our telegram for dat curation governance
            </p>
          </div>
        </ScoreBoard>
      </SidebarWrapper>

      <Content>
        <Tabs>
          <TabsButton
            href={`${accountUrl}&tab=feed`}
            selected={state.selectedTab === "feed"}
          >
            😊 Feed
          </TabsButton>
          <TabsButton
            href={`${accountUrl}&tab=proposals`}
            selected={state.selectedTab === "proposals"}
          >
            🗳️ Proposals
          </TabsButton>

          <TabsButton
            href={`${accountUrl}&tab=members`}
            selected={state.selectedTab === "members"}
          >
            🏛️ Members
          </TabsButton>
          <TabsButton
            href={`${accountUrl}&tab=overview`}
            selected={state.selectedTab === "overview"}
          >
            💬 Social
          </TabsButton>
          {isTastemaker && (
            <TabsButton
              href={`${accountUrl}&tab=tastemaker`}
              selected={state.selectedTab === "tastemaker"}
            >
              🥂 Tastemaker Code
            </TabsButton>
          )}
          {isVibee && (
            <TabsButton
              href={`${accountUrl}&tab=map`}
              selected={state.selectedTab === "map"}
            >
              🗺️ Map
            </TabsButton>
          )}

          <TabsButton
            href={`${accountUrl}&tab=sbt`}
            selected={state.selectedTab === "sbt"}
          >
            🛡️ SBT
          </TabsButton>
          <TabsButton
            href={`${accountUrl}&tab=followers`}
            selected={state.selectedTab === "followers"}
          >
            👥 Followers
          </TabsButton>
          <TabsButton
            href={`${accountUrl}&tab=jobs`}
            selected={state.selectedTab === "jobs"}
          >
            💼 Jobs
          </TabsButton>
          <TabsButton
            href={`${accountUrl}&tab=data`}
            selected={state.selectedTab === "data"}
          >
            📊 Data
          </TabsButton>
        </Tabs>

        {state.selectedTab === "discussion" && (
          <>
            <h3>Curated Posts</h3>
            <a
              className="btn btn-outline-secondary m-2"
              href="/#/hack.near/widget/DAO.Feed.Editor"
            >
              <b>Update Feed</b>
            </a>
            <hr />
            <Widget
              src={feed ?? "hack.near/widget/DAO.Social"}
              props={{ daoId: daoId }}
            />
          </>
        )}

        {state.selectedTab === "proposals" && (
          <Widget
            src="sking.near/widget/DAO.Proposals"
            props={{ daoId: daoId }}
          />
        )}
        {state.selectedTab === "map" && (
          <Widget src="efiz.near/widget/Mapbox" props={{ daoId: daoId }} />
        )}

        {state.selectedTab === "data" && (
          <Widget src="hack.near/widget/DAO.Tabs" props={{ daoId: daoId }} />
        )}

        {state.selectedTab === "proposal" && (
          <Widget
            src="sking.near/widget/DAO.Proposal"
            props={{ daoId: daoId, ...props }}
          />
        )}
        {state.selectedTab === "sbt" && (
          <>
            <Widget
              src="ndcplug.near/widget/ndc-badge-holders"
              props={{
                title: sbtTitle,
                issuer: issuer,
                showProgress: false,
                showDropdown: false,
                showHeader: false,
              }}
            />
          </>
        )}
        {state.selectedTab === "feed" && (
          <>
            <Widget
              src="proofofvibes.near/widget/Vibes.Feed.main"
              props={{ props }}
            />
          </>
        )}
        {state.selectedTab === "tastemaker" && (
          <>
            <Widget
              src="proofofvibes.near/widget/Vibes.Tastemakers.main"
              props={{}}
            />
          </>
        )}
        {state.selectedTab === "jobs" && (
          <>
            <Widget
              src="nearefi.near/widget/ReFi.Requests"
              props={{
                accountId: accountId,
                showSidebar: false,
                showHeader: false,
              }}
            />
          </>
        )}
        {state.selectedTab === "proposalId" && (
          <Widget
            src="sking.near/widget/DAO.Proposal"
            props={{ daoId, ...props }}
          />
        )}
        {state.selectedTab === "overview" && (
          <>
            {state.socialProfile.description && (
              <>
                <Title as="h2" size="19px" margin>
                  About
                </Title>

                <Bio>
                  <Widget
                    src="near/widget/SocialMarkdown"
                    props={{ text: socialProfile.description }}
                  />
                </Bio>
              </>
            )}

            <Widget
              src="near/widget/Posts.Feed"
              props={{ accounts: [accountId] }}
            />
          </>
        )}

        {state.selectedTab === "members" && (
          <Widget
            src="nearefi.near/widget/ReFi.DAO.members"
            props={{
              daoId: daoId,
              issuer: issuer,
              reference: reference,
              classId: classId,
              humanRequiredForSbt: true,
              registry: "registry.i-am-human.near",
            }}
          />
        )}

        {state.selectedTab === "followers" && (
          <Widget
            src="near/widget/FollowersList"
            props={{ accountId: daoId }}
          />
        )}

        {state.selectedTab === "bounties" && (
          <Widget
            src="sking.near/widget/DAO.Bounties"
            props={{ daoId: daoId }}
          />
        )}

        {state.selectedTab === "bounty" && (
          <Widget
            src="sking.near/widget/DAO.Bounty"
            props={{ daoId: daoId, ...props }}
          />
        )}
      </Content>
    </Main>
  </Wrapper>
);
