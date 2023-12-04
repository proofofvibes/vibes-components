const role = props.role ?? "community";
// TO-DO: check if a person has permission to do. afunction call proposal
State.init({
  copiedShareUrl: false,
});

const accountId = props.daoId ?? props.accountId ?? "refi.sputnik-dao.near";
const showLinks = props.showLinks ?? true;
const showSearchDAOs = props.showSearchDAOs ?? true;

const daoId = accountId;
const profile =
  props.profile || Social.get(`${accountId}/profile/**`, "final") || {};

if (!accountId) {
  return "";
}
const isLoggedIn = !!context.accountId;
console.log("Is logged in: " + isLoggedIn);

// Profile Data:
const tags = Object.keys(profile.tags || {});
const viewingOwnAccount = accountId === context.accountId;
const accountUrl = `/#/hack.near/widget/DAO.Page?daoId=${accountId}`;
const shareUrl = `https://near.org${accountUrl}`;

// Follower Count:
const following = Social.keys(`${accountId}/graph/follow/*`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});
const followers = Social.keys(`*/graph/follow/${accountId}`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});
const followingCount = following
  ? Object.keys(following[accountId].graph.follow || {}).length
  : null;
const followersCount = followers ? Object.keys(followers || {}).length : null;

// Account follows you:
const accountFollowsYouData = Social.keys(
  `${accountId}/graph/follow/${context.accountId}`,
  undefined,
  {
    values_only: true,
  }
);
const accountFollowsYou = Object.keys(accountFollowsYouData || {}).length > 0;

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
const policy = Near.view(daoId, "get_policy");
// const accountId = props.accountId ?? context.accountId;
const daoBond = policy.proposal_bond;
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

const canProposeToAddMember = isUserAllowedTo(
  context.accountId,
  proposalKinds.AddMemberToRole,
  actions.AddProposal
);

const canProposeFunctionCall = isUserAllowedTo(
  context.accountId,
  proposalKinds.FunctionCall,
  actions.AddProposal
);
console.log(
  "Is User Allowed To 'Add a Proposal' of type 'FunctionCall'?",
  isUserAllowedTo(
    context.accountId,
    proposalKinds.FunctionCall,
    actions.AddProposal
  )
);

console.log(
  "Is User Allowed To 'Vote Yes' on a proposal of type 'FunctionCall'?",
  isUserAllowedTo(
    context.accountId,
    proposalKinds.FunctionCall,
    actions.VoteApprove
  )
);

console.log(
  "Is User Allowed To 'Add a Proposal' of type 'AddMemberToRole'?",
  isUserAllowedTo(
    context.accountId,
    proposalKinds.AddMemberToRole,
    actions.AddProposal
  )
);
const Wrapper = styled.div`
  display: grid;
  gap: 40px;
  position: relative;

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    height: 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    text-align: center;
    cursor: pointer;
    background: #fbfcfd;
    border: 1px solid #d7dbdf;
    color: #11181c !important;

    &.button--primary {
      width: 100%;
      color: #006adc !important;

      @media (max-width: 1200px) {
        width: auto;
      }
    }

    &:hover,
    &:focus {
      background: #ecedee;
      text-decoration: none;
      outline: none;
    }

    i {
      color: #7e868c;
    }

    .bi-16 {
      font-size: 16px;
    }
  }

  @media (max-width: 900px) {
    gap: 24px;
  }
`;

const Section = styled.div`
  display: grid;
  gap: 24px;
`;

const Avatar = styled.div`
  width: 133px;
  height: 133px;
  flex-shrink: 0;
  border: 3px solid #fff;
  overflow: hidden;
  border-radius: 100%;
  box-shadow: 0px 12px 16px rgba(16, 24, 40, 0.08),
    0px 4px 6px rgba(16, 24, 40, 0.03);

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 900px) {
    width: 80px;
    height: 80px;
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

const Wrapper1 = styled.div`
  .join-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    height: 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    text-align: center;
    cursor: pointer;
    background: #fbfcfd;
    border: 1px solid #d7dbdf;
    color: ${props.primary ? "#006ADC" : "#11181C"} !important;
    white-space: nowrap;

    &:hover,
    &:focus {
      background: #ecedee;
      text-decoration: none;
      outline: none;
    }

    i {
      display: inline-block;
      transform: rotate(90deg);
      color: #7e868c;
    }
  }
`;

const Text = styled.p`
  margin: 0;
  line-height: 1.5rem;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")} !important;
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};
  overflow: ${(p) => (p.ellipsis ? "hidden" : "")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "")};
  white-space: ${(p) => (p.ellipsis ? "nowrap" : "")};
  overflow-wrap: anywhere;

  b {
    font-weight: 600;
    color: #11181c;
  }

  &[href] {
    display: inline-flex;
    gap: 0.25rem;

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
`;

const TextLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: #11181c !important;
  font-weight: 400;
  font-size: 14px;
  white-space: nowrap;
  outline: none;

  &:focus,
  &:hover {
    text-decoration: underline;
  }

  i {
    color: #7e868c;
  }
`;

const TextBadge = styled.p`
  display: inline-block;
  margin: 0;
  font-size: 10px;
  line-height: 1.1rem;
  background: #687076;
  color: #fff;
  font-weight: 600;
  white-space: nowrap;
  padding: 0 6px;
  border-radius: 3px;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
`;

const Stats = styled.div`
  display: flex;
  gap: 24px;
`;

const SocialLinks = styled.div`
  display: grid;
  gap: 9px;
`;

const FollowButtonWrapper = styled.div`
  width: 100%;
  div,
  button {
    width: 100%;
  }
  @media (max-width: 1200px) {
    width: auto;
    div,
    button {
      width: auto;
    }
  }
`;

return (
  <Wrapper>
    <Avatar>
      <Widget
        src="mob.near/widget/Image"
        props={{
          image: profile.image,
          alt: profile.name,
          fallbackUrl:
            "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
        }}
      />
    </Avatar>

    <Section>
      <div>
        <Title>{profile.name || accountId}</Title>
        <Text>@{accountId}</Text>

        {accountFollowsYou && <TextBadge>Follows You</TextBadge>}
      </div>
      {profile.description && (
        <div>
          <Widget
            src="near/widget/SocialMarkdown"
            props={{ text: profile.description }}
          />
        </div>
      )}

      <Actions>
        {viewingOwnAccount ? (
          <a
            className="button button--primary"
            href="#/near/widget/ProfileEditor"
          >
            <i className="bi bi-pencil"></i>
            Edit Profile
          </a>
        ) : context.accountId ? (
          <>
            <FollowButtonWrapper>
              <Widget
                src="near/widget/FollowButton"
                props={{
                  accountId,
                }}
              />
            </FollowButtonWrapper>
          </>
        ) : (
          <></>
        )}
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Copy URL to clipboard</Tooltip>}
        >
          <button
            className="button"
            type="button"
            onMouseLeave={() => {
              State.update({ copiedShareUrl: false });
            }}
            onClick={() => {
              clipboard.writeText(shareUrl).then(() => {
                State.update({ copiedShareUrl: true });
              });
            }}
          >
            {state.copiedShareUrl ? (
              <i className="bi-16 bi bi-check"></i>
            ) : (
              <i className="bi-16 bi-link-45deg"></i>
            )}
            Share
          </button>
        </OverlayTrigger>
      </Actions>

      <Actions>
        {isLoggedIn && (
          <FollowButtonWrapper>
            <Widget
              src="ndcplug.near/widget/DAO.Join"
              props={{
                daoId: accountId,
                role,
              }}
            />
          </FollowButtonWrapper>
        )}
      </Actions>
      {isLoggedIn && canProposeFunctionCall && (
        <a
          className="button button--primary"
          href={`#/nearefi.near/widget/ReFi.DAO.Propose.profileUpdate?daoId=${accountId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-pencil"></i>
          Propose Edit Profile
        </a>
      )}
      {isLoggedIn && canProposeFunctionCall && (
        <a
          className="button button--primary"
          href={`#/nearefi.near/widget/ReFi.DAO.Propose.post?daoId=${accountId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-pencil"></i>
          Propose To Make A Post
        </a>
      )}
      {isLoggedIn && (
        <Widget
          src={`ndcplug.near/widget/DAO.main.sidebar.donate`}
          props={{ reciever: accountId }}
        />
      )}
    </Section>

    <Section>
      <Stats>
        <Text as="a" href={`${accountUrl}&tab=following`}>
          <b bold as="span">
            {followingCount === null ? "--" : followingCount}
          </b>{" "}
          Following
        </Text>
        <Text as="a" href={`${accountUrl}&tab=followers`}>
          <b>{followersCount === null ? "--" : followersCount}</b> Followers
        </Text>
      </Stats>
      {tags.length > 0 && (
        <Widget
          src="near/widget/Tags"
          props={{
            tags,
          }}
        />
      )}
    </Section>

    {profile.linktree && (
      <Section>
        {showLinks && (
          <SocialLinks>
            {profile.linktree.website && (
              <TextLink
                href={`https://${profile.linktree.website}`}
                target="_blank"
              >
                <i className="bi bi-globe"></i> {profile.linktree.website}
              </TextLink>
            )}

            {profile.linktree.github && (
              <TextLink
                href={`https://github.com/${profile.linktree.github}`}
                target="_blank"
              >
                <i className="bi bi-github"></i> {profile.linktree.github}
              </TextLink>
            )}

            {profile.linktree.twitter && (
              <TextLink
                href={`https://twitter.com/${profile.linktree.twitter}`}
                target="_blank"
              >
                <i className="bi bi-twitter"></i> {profile.linktree.twitter}
              </TextLink>
            )}

            {profile.linktree.telegram && (
              <TextLink
                href={`https://t.me/${profile.linktree.telegram}`}
                target="_blank"
              >
                <i className="bi bi-telegram"></i> {profile.linktree.telegram}
              </TextLink>
            )}
          </SocialLinks>
        )}
        {showSearchDAOs && (
          <Wrapper1>
            <a href="#/ndcplug.near/widget/AllDAOs" target="_blank">
              <button className="join-button">Search All DAOs</button>
            </a>
          </Wrapper1>
        )}
      </Section>
    )}
  </Wrapper>
);
