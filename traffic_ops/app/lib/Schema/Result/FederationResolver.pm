use utf8;
package Schema::Result::FederationResolver;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

Schema::Result::FederationResolver

=cut

use strict;
use warnings;

use base 'DBIx::Class::Core';

=head1 TABLE: C<federation_resolver>

=cut

__PACKAGE__->table("federation_resolver");

=head1 ACCESSORS

=head2 id

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0

=head2 ip_address

  data_type: 'varchar'
  is_nullable: 0
  size: 50

=head2 last_updated

  data_type: 'timestamp'
  datetime_undef_if_invalid: 1
  default_value: current_timestamp
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "id",
  { data_type => "integer", is_auto_increment => 1, is_nullable => 0 },
  "ip_address",
  { data_type => "varchar", is_nullable => 0, size => 50 },
  "last_updated",
  {
    data_type => "timestamp",
    datetime_undef_if_invalid => 1,
    default_value => \"current_timestamp",
    is_nullable => 1,
  },
);

=head1 PRIMARY KEY

=over 4

=item * L</id>

=back

=cut

__PACKAGE__->set_primary_key("id");

=head1 UNIQUE CONSTRAINTS

=head2 C<federation_resolver_ip_address>

=over 4

=item * L</ip_address>

=back

=cut

__PACKAGE__->add_unique_constraint("federation_resolver_ip_address", ["ip_address"]);

=head1 RELATIONS

=head2 federation_federation_resolvers

Type: has_many

Related object: L<Schema::Result::FederationFederationResolver>

=cut

__PACKAGE__->has_many(
  "federation_federation_resolvers",
  "Schema::Result::FederationFederationResolver",
  { "foreign.federation_resolver" => "self.id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 federations

Type: has_many

Related object: L<Schema::Result::Federation>

=cut

__PACKAGE__->has_many(
  "federations",
  "Schema::Result::Federation",
  { "foreign.federation_resolver_id" => "self.id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07042 @ 2015-09-28 13:05:02
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:lb7TFPtHAh3bbLcwvRa5uw


# You can replace this text with custom code or comments, and it will be preserved on regeneration
1;
