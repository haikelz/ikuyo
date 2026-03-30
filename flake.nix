{
  description = "ikuyo setup";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            bun
            nodejs_22
            git
            jq
            ripgrep
            fd
            gnugrep
            gnutar
            gzip
          ];

          shellHook = ''
            echo "Nix dev shell ready: bun $(bun --version)"
          '';
        };
      });
}
