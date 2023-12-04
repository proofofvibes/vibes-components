const accountId = props.accountId ?? context.accountId;
const daoId = props.daoId ?? "refi.sputnik-dao.near";
const issuer = props.issuer ?? "issuer.regens.near";
const classId = props.classId ?? 1;
const policy = Near.view(daoId, "get_policy");
const reference = props.reference ?? null;
const registry = props.registry ?? "registry.i-am-human.near";
const humanRequiredForSbt = props.humanRequiredForSbt ?? false;
const groups = policy.roles
  .filter((role) => role.kind.Group)
  .map((role) => ({
    name: role.name,
    members: role.kind.Group,
  }));

return (
  <div>
    {groups.map((group, i) => (
      <div key={i}>
        <h3>{group.name}</h3>
        {group.members.map((member, j) => (
          <div className="d-flex justify-content-between mb-3">
            <Widget
              src="nearefi.near/widget/ReFi.DAO.memberCard"
              props={{
                daoId: daoId,
                classId: classId,
                issuer: issuer,
                accountId: member,
                roleName: group.name,
                reference: reference,
                registry: registry,
                humanRequiredForSbt: humanRequiredForSbt,
              }}
            />
          </div>
        ))}
      </div>
    ))}
  </div>
);
